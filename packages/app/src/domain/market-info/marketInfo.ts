import BigNumber from 'bignumber.js'

import { getChainConfigEntry } from '@/config/chain'
import { NativeAssetInfo } from '@/config/chain/types'
import { NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { raise } from '@/utils/assert'
import { fromRay } from '@/utils/math'

import { bigNumberify } from '../../utils/bigNumber'
import { CheckedAddress } from '../types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { Token } from '../types/Token'
import { TokenSymbol } from '../types/TokenSymbol'
import { AaveData } from './aave-data-layer/query'
import { determineEModeState, extractEmodeInfoFromReserves } from './emode'
import { IncentivesData, getIncentivesData } from './incentives'
import { parseRawPercentage } from './math'
import {
  BorrowEligibilityStatus,
  CollateralEligibilityStatus,
  ReserveStatus,
  SupplyAvailabilityStatus,
  getBorrowEligibilityStatus,
  getCollateralEligibilityStatus,
  getReserveStatus,
  getSupplyAvailabilityStatus,
} from './reserve-status'
import {
  determineIsolationModeState,
  determineSiloBorrowingState,
  normalizeUserSummary as normalizeUserPositionSummary,
} from './utils'

export interface Reserve {
  token: Token

  aToken: Token
  variableDebtTokenAddress: CheckedAddress

  status: ReserveStatus

  supplyAvailabilityStatus: SupplyAvailabilityStatus
  collateralEligibilityStatus: CollateralEligibilityStatus
  borrowEligibilityStatus: BorrowEligibilityStatus

  isIsolated: boolean
  isBorrowableInIsolation: boolean // in practice this is true only for stablecoins
  isSiloedBorrowing: boolean
  eModeCategory?: EModeCategory

  // @note: available liquidity respects borrow cap, so it can be negative when the cap is reached and breached (interests)
  availableLiquidity: NormalizedUnitNumber
  availableLiquidityUSD: NormalizedUnitNumber
  supplyCap?: NormalizedUnitNumber
  borrowCap?: NormalizedUnitNumber
  totalLiquidity: NormalizedUnitNumber // = supplied
  totalLiquidityUSD: NormalizedUnitNumber
  totalDebt: NormalizedUnitNumber
  totalDebtUSD: NormalizedUnitNumber
  totalVariableDebt: NormalizedUnitNumber
  totalVariableDebtUSD: NormalizedUnitNumber
  isolationModeTotalDebt: NormalizedUnitNumber // @note: this is already divided by debtCeilingDecimals
  debtCeiling: NormalizedUnitNumber // @note: this is already divided by debtCeilingDecimals
  supplyAPY: Percentage | undefined
  maxLtv: Percentage
  liquidationThreshold: Percentage
  liquidationBonus: Percentage
  reserveFactor: Percentage
  aTokenBalance: NormalizedUnitNumber

  lastUpdateTimestamp: number

  variableBorrowIndex: BigNumber
  variableBorrowRate: BigNumber
  liquidityIndex: BigNumber
  liquidityRate: BigNumber
  variableRateSlope1: BigNumber
  variableRateSlope2: BigNumber
  optimalUtilizationRate: Percentage
  utilizationRate: Percentage
  baseVariableBorrowRate: BigNumber

  variableBorrowApy: Percentage | undefined

  priceInUSD: BigNumber

  usageAsCollateralEnabled: boolean
  usageAsCollateralEnabledOnUser: boolean

  incentives: IncentivesData
}

export interface UserPosition {
  reserve: Reserve
  scaledVariableDebt: BigNumber
  scaledATokenBalance: BigNumber
  collateralBalance: NormalizedUnitNumber
  borrowBalance: NormalizedUnitNumber
}

export interface UserPositionSummary {
  loanToValue: Percentage
  maxLoanToValue: Percentage
  healthFactor: BigNumber | undefined
  availableBorrowsUSD: NormalizedUnitNumber
  totalBorrowsUSD: NormalizedUnitNumber
  currentLiquidationThreshold: Percentage
  totalCollateralUSD: NormalizedUnitNumber
  totalLiquidityUSD: NormalizedUnitNumber
}

export type EModeState = { enabled: false } | { enabled: true; category: EModeCategory }
export type SiloBorrowingState = { enabled: false } | { enabled: true; siloedBorrowingReserve: Reserve }
export type IsolatedBorrowingState = { enabled: false } | { enabled: true; isolatedBorrowingReserve: Reserve }

export interface UserConfiguration {
  eModeState: EModeState
  isolationModeState: IsolatedBorrowingState
  siloBorrowingState: SiloBorrowingState
}

export interface EModeCategory {
  id: number
  name: string
  ltv: Percentage
  liquidationThreshold: Percentage
  liquidationBonus: Percentage
}
export type EModeCategories = Record<number, EModeCategory>

export class MarketInfo {
  private readonly nativePosition: UserPosition

  constructor(
    public readonly reserves: Reserve[],
    public readonly userPositions: UserPosition[], // exists for every reserve, even if empty
    public readonly userPositionSummary: UserPositionSummary,
    public readonly userConfiguration: UserConfiguration,
    public readonly emodeCategories: EModeCategories,
    public readonly timestamp: number,
    public readonly chainId: number,
    private readonly nativeAssetInfo: NativeAssetInfo,
  ) {
    const wrappedNativeAssetPosition =
      userPositions.find((p) => p.reserve.token.symbol === nativeAssetInfo.wrappedNativeAssetSymbol) ??
      raise('Wrapped native reserve not found.')
    const wrappedNativeToken = wrappedNativeAssetPosition.reserve.token
    const nativeReserve = {
      ...wrappedNativeAssetPosition.reserve,
      token: wrappedNativeToken.clone({
        symbol: nativeAssetInfo.nativeAssetSymbol,
        name: nativeAssetInfo.nativeAssetName,
        address: NATIVE_ASSET_MOCK_ADDRESS,
      }),
    }
    this.nativePosition = {
      ...wrappedNativeAssetPosition,
      reserve: nativeReserve,
    }
  }

  get DAI(): Token {
    return this.findOneTokenBySymbol(getChainConfigEntry(this.chainId).daiSymbol)
  }

  get sDAI(): Token {
    return this.findOneTokenBySymbol(getChainConfigEntry(this.chainId).sDaiSymbol)
  }

  findTokenBySymbol(symbol: TokenSymbol): Token | undefined {
    return this.findReserveByATokenSymbol(symbol)?.aToken ?? this.findReserveBySymbol(symbol)?.token
  }
  findOneTokenBySymbol(symbol: TokenSymbol): Token {
    return this.findTokenBySymbol(symbol) ?? raise(`Token ${symbol} not found`)
  }

  findReserveBySymbol(symbol: TokenSymbol): Reserve | undefined {
    if (symbol === this.nativeAssetInfo.nativeAssetSymbol) {
      return this.nativePosition.reserve
    }

    return this.findReserveByATokenSymbol(symbol) ?? this.reserves.find((r) => r.token.symbol === symbol)
  }
  findReserveByToken(token: Token): Reserve | undefined {
    return this.findReserveBySymbol(token.symbol)
  }
  findReserveByUnderlyingAsset(underlyingAsset: CheckedAddress): Reserve | undefined {
    if (underlyingAsset === NATIVE_ASSET_MOCK_ADDRESS) {
      return this.nativePosition.reserve
    }

    return this.reserves.find((r) => r.token.address === underlyingAsset)
  }
  findReserveByATokenSymbol(symbol: TokenSymbol): Reserve | undefined {
    return this.reserves.find((r) => r.aToken.symbol === symbol)
  }
  findOneReserveBySymbol(symbol: TokenSymbol): Reserve {
    return this.findReserveBySymbol(symbol) ?? raise(`Reserve ${symbol} not found`)
  }
  findOneReserveByToken(token: Token): Reserve {
    return this.findOneReserveBySymbol(token.symbol)
  }
  findOneReserveByUnderlyingAsset(underlyingAsset: CheckedAddress): Reserve {
    return this.findReserveByUnderlyingAsset(underlyingAsset) ?? raise(`Reserve ${underlyingAsset} not found`)
  }

  findPositionBySymbol(symbol: TokenSymbol): UserPosition | undefined {
    if (symbol === this.nativeAssetInfo.nativeAssetSymbol) {
      return this.nativePosition
    }

    return this.findPositionByATokenSymbol(symbol) ?? this.userPositions.find((p) => p.reserve.token.symbol === symbol)
  }
  findPositionByToken(token: Token): UserPosition | undefined {
    return this.findPositionBySymbol(token.symbol)
  }
  findPositionByATokenSymbol(symbol: TokenSymbol): UserPosition | undefined {
    return this.userPositions.find((p) => p.reserve.aToken.symbol === symbol)
  }
  findOnePositionBySymbol(symbol: TokenSymbol): UserPosition {
    return this.findPositionBySymbol(symbol) ?? raise(`Position ${symbol} not found`)
  }
  findOnePositionByToken(token: Token): UserPosition {
    return this.findOnePositionBySymbol(token.symbol)
  }
}

export function marketInfo(rawAaveData: AaveData, nativeAssetInfo: NativeAssetInfo, chainId: number): MarketInfo {
  const tokens = rawAaveData.userSummary.userReservesData.map(
    (r): Token =>
      new Token({
        address: CheckedAddress(r.reserve.underlyingAsset),
        symbol: TokenSymbol(r.reserve.symbol),
        name: r.reserve.name,
        decimals: r.reserve.decimals,
        unitPriceUsd: r.reserve.priceInUSD,
      }),
  )

  /* eslint-disable func-style */
  const findOneTokenBySymbol = (symbol: TokenSymbol): Token => {
    return tokens.find((t) => t.symbol === symbol) ?? raise(`Token ${symbol} not found`)
  }
  /* eslint-enable func-style */

  const eModeCategories = extractEmodeInfoFromReserves(rawAaveData.formattedReserves)

  const reserves = rawAaveData.userSummary.userReservesData.map((r): Reserve => {
    const token = findOneTokenBySymbol(TokenSymbol(r.reserve.symbol))
    const supplyAvailabilityStatus = getSupplyAvailabilityStatus(r.reserve)
    const collateralEligibilityStatus = getCollateralEligibilityStatus(r.reserve)
    const borrowEligibilityStatus = getBorrowEligibilityStatus(r.reserve)

    return {
      token,

      aToken: token.createAToken(CheckedAddress(r.reserve.aTokenAddress)),
      variableDebtTokenAddress: CheckedAddress(r.reserve.variableDebtTokenAddress),

      status: getReserveStatus(r.reserve),

      supplyAvailabilityStatus,
      collateralEligibilityStatus,
      borrowEligibilityStatus,

      isIsolated: r.reserve.isIsolated,
      eModeCategory:
        r.reserve.eModeCategoryId !== 0
          ? eModeCategories[r.reserve.eModeCategoryId] ?? raise(`EMode category ${r.reserve.eModeCategoryId} not found`)
          : undefined,
      isSiloedBorrowing: r.reserve.isSiloedBorrowing,
      isBorrowableInIsolation: r.reserve.borrowableInIsolation,

      availableLiquidity: NormalizedUnitNumber(r.reserve.formattedAvailableLiquidity), // @note: r.reserve.availableLiquidity doesn't respect borrow caps so we use formattedAvailableLiquidity which does
      availableLiquidityUSD: NormalizedUnitNumber(r.reserve.availableLiquidityUSD),
      supplyCap: r.reserve.supplyCap !== '0' ? NormalizedUnitNumber(r.reserve.supplyCap) : undefined,
      borrowCap: r.reserve.borrowCap !== '0' ? NormalizedUnitNumber(r.reserve.borrowCap) : undefined,
      totalLiquidity: NormalizedUnitNumber(r.reserve.totalLiquidity),
      totalLiquidityUSD: NormalizedUnitNumber(r.reserve.totalLiquidityUSD),
      totalDebt: NormalizedUnitNumber(r.reserve.totalDebt),
      totalDebtUSD: NormalizedUnitNumber(r.reserve.totalDebtUSD),
      totalVariableDebt: NormalizedUnitNumber(r.reserve.totalVariableDebt),
      totalVariableDebtUSD: NormalizedUnitNumber(r.reserve.totalVariableDebtUSD),
      isolationModeTotalDebt: NormalizedUnitNumber(r.reserve.isolationModeTotalDebtUSD),
      debtCeiling: NormalizedUnitNumber(r.reserve.debtCeilingUSD),
      supplyAPY: supplyAvailabilityStatus === 'yes' ? Percentage(r.reserve.supplyAPY) : undefined,
      maxLtv: parseRawPercentage(r.reserve.baseLTVasCollateral),
      liquidationThreshold: parseRawPercentage(r.reserve.reserveLiquidationThreshold),
      liquidationBonus: bigNumberify(r.reserve.formattedReserveLiquidationBonus).gt(0)
        ? Percentage(r.reserve.formattedReserveLiquidationBonus)
        : Percentage(0),
      variableBorrowApy: borrowEligibilityStatus === 'yes' ? Percentage(r.reserve.variableBorrowAPY) : undefined,
      reserveFactor: Percentage(r.reserve.reserveFactor),
      aTokenBalance: NormalizedUnitNumber(r.underlyingBalance),

      lastUpdateTimestamp: r.reserve.lastUpdateTimestamp,

      variableBorrowIndex: bigNumberify(r.reserve.variableBorrowIndex),
      variableBorrowRate: bigNumberify(r.reserve.variableBorrowRate),
      liquidityIndex: bigNumberify(r.reserve.liquidityIndex),
      liquidityRate: bigNumberify(r.reserve.liquidityRate),
      variableRateSlope1: bigNumberify(r.reserve.variableRateSlope1),
      variableRateSlope2: bigNumberify(r.reserve.variableRateSlope2),
      optimalUtilizationRate: Percentage(fromRay(r.reserve.optimalUsageRatio)),
      utilizationRate: Percentage(r.reserve.borrowUsageRatio),
      baseVariableBorrowRate: NormalizedUnitNumber(r.reserve.baseVariableBorrowRate),

      priceInUSD: bigNumberify(r.reserve.priceInUSD),

      usageAsCollateralEnabled: r.reserve.usageAsCollateralEnabled,
      usageAsCollateralEnabledOnUser: r.usageAsCollateralEnabledOnUser,

      // incentives are fetched from the blockchain
      incentives: getIncentivesData(r.reserve, findOneTokenBySymbol),
    }
  })

  const userPositions = rawAaveData.rawUserReserves.map((r): UserPosition => {
    const reserve = reserves.find((res) => res.token.address === r.underlyingAsset)!
    const formattedReserve = rawAaveData.userSummary.userReservesData.find(
      (res) => res.underlyingAsset === r.underlyingAsset,
    )!

    return {
      reserve,
      scaledATokenBalance: bigNumberify(r.scaledATokenBalance),
      scaledVariableDebt: bigNumberify(r.scaledVariableDebt),
      collateralBalance: NormalizedUnitNumber(formattedReserve.underlyingBalance),
      borrowBalance: NormalizedUnitNumber(formattedReserve.variableBorrows),
    }
  })

  const userPositionSummary = normalizeUserPositionSummary(rawAaveData.userSummary)

  const userConfiguration: UserConfiguration = {
    eModeState: determineEModeState(rawAaveData.userEmodeCategoryId, eModeCategories),
    isolationModeState: determineIsolationModeState(rawAaveData.userSummary, reserves),
    siloBorrowingState: determineSiloBorrowingState(userPositions),
  }

  return new MarketInfo(
    reserves,
    userPositions,
    userPositionSummary,
    userConfiguration,
    eModeCategories,
    rawAaveData.timestamp,
    chainId,
    nativeAssetInfo,
  )
}
