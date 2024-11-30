import BigNumber from 'bignumber.js'

import { NativeAssetInfo } from '@/config/chain/types'
import { AaveData, RawAaveUserReserve } from '@/domain/market-info/aave-data-layer/query'
import { MarketInfo, Reserve, UserPosition, UserPositionSummary } from '@/domain/market-info/marketInfo'
import { getCompoundedScaledBalance, getScaledBalance } from '@/domain/market-info/math'
import { mergeUserPositionIntoRawUserReserve, recalculateUserSummary } from '@/domain/market-info/utils'
import { bigNumberify } from '@/utils/bigNumber'

import { ReserveWithValue } from '../common/types'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { NormalizedUnitNumber } from '../types/NumericValues'

export interface ReserveWithUseAsCollateralFlag {
  reserve: Reserve
  useAsCollateral: boolean
}

export interface UpdatePositionSummaryParams {
  borrows?: ReserveWithValue[]
  deposits?: ReserveWithValue[]
  withdrawals?: ReserveWithValue[]
  repays?: ReserveWithValue[]
  reservesWithUseAsCollateralFlag?: ReserveWithUseAsCollateralFlag[]
  aaveData: AaveData
  marketInfo: MarketInfo
  eModeCategoryId?: number
  nativeAssetInfo: NativeAssetInfo
}

export function updatePositionSummary({
  borrows = [],
  deposits = [],
  withdrawals = [],
  repays = [],
  reservesWithUseAsCollateralFlag = [],
  marketInfo,
  aaveData,
  eModeCategoryId,
  nativeAssetInfo,
}: UpdatePositionSummaryParams): UserPositionSummary {
  const timestamp = marketInfo.timestamp
  const newUserPositions = marketInfo.userPositions
    .map(getUserPositionMapper(timestamp, deposits, nativeAssetInfo, 'deposit'))
    .map(getUserPositionMapper(timestamp, withdrawals, nativeAssetInfo, 'withdraw'))
    .map(getUserPositionMapper(timestamp, borrows, nativeAssetInfo, 'borrow'))
    .map(getUserPositionMapper(timestamp, repays, nativeAssetInfo, 'repay'))

  const newRawUserReserves = mergeUserPositionIntoRawUserReserve(newUserPositions, aaveData.rawUserReserves).map(
    (r, index) =>
      tweakUseAsCollateral({
        rawUserReserve: aaveData.rawUserReserves[index]!,
        updatedRawUserReserve: r,
        reservesWithUseAsCollateralFlag,
        deposits,
        withdrawals,
        nativeAssetInfo,
      }),
  )

  const currentEModeCategoryId = marketInfo.userConfiguration.eModeState.enabled
    ? marketInfo.userConfiguration.eModeState.category.id
    : 0

  const userSummary = recalculateUserSummary({
    currentTimestamp: timestamp,
    formattedReserves: aaveData.formattedReserves,
    rawUserReserves: newRawUserReserves,
    baseCurrency: aaveData.baseCurrency,
    eModeCategoryId: eModeCategoryId ?? currentEModeCategoryId,
  })

  return userSummary
}

function getUserPositionMapper(
  timestamp: number,
  reserves: ReserveWithValue[],
  nativeAssetInfo: NativeAssetInfo,
  type: 'deposit' | 'withdraw' | 'borrow' | 'repay',
) {
  return (userPosition: UserPosition): UserPosition => {
    const value = getValueForUserPosition(userPosition, reserves, nativeAssetInfo)
    if (!value) {
      return userPosition
    }

    if (type === 'deposit' || type === 'withdraw') {
      return tweakDepositPosition(timestamp, type, value, userPosition)
    }

    return tweakBorrowPosition(timestamp, type, value, userPosition)
  }
}

function getValueForUserPosition(
  userPosition: UserPosition,
  reserves: ReserveWithValue[],
  nativeAssetInfo: NativeAssetInfo,
): NormalizedUnitNumber | undefined {
  if (userPosition.reserve.token.symbol === nativeAssetInfo.wrappedNativeAssetSymbol) {
    const nativeAssetValue = reserves.find((d) => d.reserve.token.symbol === nativeAssetInfo.nativeAssetSymbol)?.value
    if (nativeAssetValue) {
      return nativeAssetValue
    }
  }

  return reserves.find((r) => r.reserve.token.symbol === userPosition.reserve.token.symbol)?.value
}

function findReserveWithValue<T extends { reserve: Reserve }>(
  rawUserReserve: RawAaveUserReserve,
  reserves: T[],
  nativeAssetInfo: NativeAssetInfo,
): T | undefined {
  return reserves.find((r) => {
    if (r.reserve.token.symbol === nativeAssetInfo.nativeAssetSymbol) {
      return nativeAssetInfo.wrappedNativeAssetAddress === CheckedAddress(rawUserReserve.underlyingAsset)
    }

    return r.reserve.token.address === CheckedAddress(rawUserReserve.underlyingAsset)
  })
}

function tweakDepositPosition(
  timestamp: number,
  type: 'deposit' | 'withdraw',
  value: NormalizedUnitNumber,
  userPosition: UserPosition,
): UserPosition {
  if (value.eq(0)) {
    return userPosition
  }
  const reserve = userPosition.reserve

  const updatedBalance = getScaledBalance({
    balance: reserve.token.toBaseUnit(value),
    index: reserve.liquidityIndex,
    rate: reserve.liquidityRate,
    lastUpdateTimestamp: reserve.lastUpdateTimestamp,
    timestamp,
  }).multipliedBy(type === 'withdraw' ? -1 : 1)

  return {
    ...userPosition,
    scaledATokenBalance: BigNumber.max(userPosition.scaledATokenBalance.plus(updatedBalance), 0),
  }
}

function tweakBorrowPosition(
  timestamp: number,
  type: 'borrow' | 'repay',
  value: NormalizedUnitNumber,
  userPosition: UserPosition,
): UserPosition {
  if (value.eq(0)) {
    return userPosition
  }
  const reserve = userPosition.reserve

  const updatedBalance = getCompoundedScaledBalance({
    balance: reserve.token.toBaseUnit(value),
    index: reserve.variableBorrowIndex,
    rate: reserve.variableBorrowRate,
    lastUpdateTimestamp: reserve.lastUpdateTimestamp,
    timestamp,
  }).multipliedBy(type === 'repay' ? -1 : 1)

  return {
    ...userPosition,
    scaledVariableDebt: BigNumber.max(userPosition.scaledVariableDebt.plus(updatedBalance), 0),
  }
}

export interface TweakUseAsCollateralParams {
  rawUserReserve: RawAaveUserReserve
  updatedRawUserReserve: RawAaveUserReserve
  reservesWithUseAsCollateralFlag: ReserveWithUseAsCollateralFlag[]
  deposits: ReserveWithValue[]
  withdrawals: ReserveWithValue[]
  nativeAssetInfo: NativeAssetInfo
}
function tweakUseAsCollateral({
  rawUserReserve,
  updatedRawUserReserve,
  reservesWithUseAsCollateralFlag,
  deposits,
  withdrawals,
  nativeAssetInfo,
}: TweakUseAsCollateralParams): RawAaveUserReserve {
  const reserve = findReserveWithValue(rawUserReserve, reservesWithUseAsCollateralFlag, nativeAssetInfo)
  if (reserve) {
    return {
      ...updatedRawUserReserve,
      usageAsCollateralEnabledOnUser: reserve.useAsCollateral,
    }
  }

  const withdrawnReserve = findReserveWithValue(rawUserReserve, withdrawals, nativeAssetInfo)
  if (
    withdrawnReserve &&
    bigNumberify(updatedRawUserReserve.scaledATokenBalance).eq(0) &&
    bigNumberify(rawUserReserve.scaledATokenBalance).gt(0)
  ) {
    return {
      ...updatedRawUserReserve,
      usageAsCollateralEnabledOnUser: false,
    }
  }

  const depositedReserve = findReserveWithValue(rawUserReserve, deposits, nativeAssetInfo)
  if (
    depositedReserve &&
    bigNumberify(updatedRawUserReserve.scaledATokenBalance).gt(0) &&
    bigNumberify(rawUserReserve.scaledATokenBalance).eq(0)
  ) {
    return {
      ...updatedRawUserReserve,
      usageAsCollateralEnabledOnUser: true,
    }
  }

  return updatedRawUserReserve
}
