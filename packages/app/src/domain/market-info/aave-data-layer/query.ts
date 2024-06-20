import { formatReservesAndIncentives, formatUserSummary } from '@aave/math-utils'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { multicall } from 'wagmi/actions'

import {
  lendingPoolAddressProviderAddress,
  uiIncentiveDataProviderAbi,
  uiIncentiveDataProviderAddress,
  uiPoolDataProviderAbi,
  uiPoolDataProviderAddress,
} from '@/config/contracts-generated'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { queryOptions } from '@tanstack/react-query'
import { getContractAddress } from '../../hooks/useContractAddress'

export interface AaveDataLayerQueryKeyArgs {
  chainId: number
  account?: Address
}
export function aaveDataLayerQueryKey({ chainId, account }: AaveDataLayerQueryKeyArgs): unknown[] {
  return ['reserves', account, chainId]
}
export interface AaveDataLayerArgs extends AaveDataLayerQueryKeyArgs {
  wagmiConfig: Config
  timeAdvance?: number
}

export type AaveData = ReturnType<ReturnType<typeof aaveDataLayerSelectFn>>
export type AaveUserSummary = AaveData['userSummary']
export type AaveUserReserve = AaveUserSummary['userReservesData'][number]['reserve']
export type RawAaveUserReserve = AaveData['rawUserReserves'][number]
export type AaveFormattedReserve = AaveData['formattedReserves'][number]
export type AaveBaseCurrency = AaveData['baseCurrency']
export type AaveUserSummaryReservesData = AaveUserSummary['userReservesData']
export type AaveDataLayerQueryReturnType = Awaited<ReturnType<ReturnType<typeof aaveDataLayerQueryFn>>>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function aaveDataLayer({ wagmiConfig, chainId, account, timeAdvance }: AaveDataLayerArgs) {
  const uiPoolDataProvider = getContractAddress(uiPoolDataProviderAddress, chainId)
  const lendingPoolAddressProvider = getContractAddress(lendingPoolAddressProviderAddress, chainId)
  const uiIncentiveDataProvider = getContractAddress(uiIncentiveDataProviderAddress, chainId)

  return queryOptions({
    queryKey: aaveDataLayerQueryKey({ chainId, account }),
    queryFn: aaveDataLayerQueryFn({
      uiPoolDataProvider,
      lendingPoolAddressProvider,
      uiIncentiveDataProvider,
      wagmiConfig,
      chainId,
      account,
    }),
    select: aaveDataLayerSelectFnWithCache({ timeAdvance }),
  })
}

interface AaveDataLayerQueryFnArgs {
  uiPoolDataProvider: CheckedAddress
  lendingPoolAddressProvider: CheckedAddress
  uiIncentiveDataProvider: CheckedAddress
  wagmiConfig: Config
  chainId: number
  account?: Address
}
function aaveDataLayerQueryFn({
  uiPoolDataProvider,
  lendingPoolAddressProvider,
  uiIncentiveDataProvider,
  wagmiConfig,
  chainId,
  account,
}: AaveDataLayerQueryFnArgs) {
  return async () => {
    const contractData = await multicall(wagmiConfig, {
      allowFailure: false,
      chainId,
      contracts: [
        {
          address: uiPoolDataProvider,
          functionName: 'getReservesData',
          args: [lendingPoolAddressProvider],
          abi: uiPoolDataProviderAbi,
        },
        {
          address: uiIncentiveDataProvider,
          abi: uiIncentiveDataProviderAbi,
          functionName: 'getReservesIncentivesData',
          args: [lendingPoolAddressProvider],
        },
        {
          address: uiPoolDataProvider,
          abi: uiPoolDataProviderAbi,
          functionName: 'getUserReservesData',
          args: [lendingPoolAddressProvider, account ?? uiPoolDataProvider], // little hack to support properly formatted data for guest
        },
      ],
    })

    return {
      contractData,
      chainId,
      lendingPoolAddressProvider,
    }
  }
}

const aaveDataLayerSelectFnCache = new Map<number, ReturnType<typeof aaveDataLayerSelectFn>>()
export interface AaveDataLayerSelectFnParams {
  timeAdvance?: number // time advance in seconds
}

// The cache is needed to ensure referential stability of the select function.
// This will create a new function for every timeAdvance value and store it in the cache.
// This helps to avoid unnecessary invocations of the select function in the react-query.
// If the select function is inlined, it will be invoked on every render because of the referential instability.
// Using this wrapper function, we can ensure that the select function is stable and will be invoked only when the data changes.
function aaveDataLayerSelectFnWithCache({
  timeAdvance,
}: AaveDataLayerSelectFnParams = {}): ReturnType<typeof aaveDataLayerSelectFn> {
  const key = timeAdvance ?? 0

  if (aaveDataLayerSelectFnCache.has(key)) {
    return aaveDataLayerSelectFnCache.get(key)!
  }

  const selectFn = aaveDataLayerSelectFn({ timeAdvance })
  aaveDataLayerSelectFnCache.set(key, selectFn)
  return selectFn
}

function aaveDataLayerSelectFn({ timeAdvance }: AaveDataLayerSelectFnParams) {
  return (data: AaveDataLayerQueryReturnType) => {
    const { contractData, chainId, lendingPoolAddressProvider } = data
    const [[reserves, baseCurrencyInfo], reservesIncentiveData, [userReserves, userEmodeCategoryId]] = contractData

    const currentTimestamp = Math.floor(Date.now() / 1000) + (timeAdvance ?? 0)

    const baseCurrency = {
      marketReferenceCurrencyDecimals: baseCurrencyInfo.marketReferenceCurrencyUnit.toString().length - 1,
      marketReferenceCurrencyPriceInUsd: baseCurrencyInfo.marketReferenceCurrencyPriceInUsd.toString(),
      networkBaseTokenPriceInUsd: baseCurrencyInfo.networkBaseTokenPriceInUsd.toString(),
      networkBaseTokenPriceDecimals: baseCurrencyInfo.networkBaseTokenPriceDecimals,
    }

    const rawUserReserves = userReserves.map((r) => ({
      ...r,
      scaledATokenBalance: r.scaledATokenBalance.toString(),
      stableBorrowRate: r.stableBorrowRate.toString(),
      scaledVariableDebt: r.scaledVariableDebt.toString(),
      principalStableDebt: r.principalStableDebt.toString(),
      stableBorrowLastUpdateTimestamp: Number(r.stableBorrowLastUpdateTimestamp),
    }))

    const formattedReserves = formatReservesAndIncentives({
      reserveIncentives: reservesIncentiveData.map((r) => ({
        ...r,
        aIncentiveData: {
          ...r.aIncentiveData,
          rewardsTokenInformation: r.aIncentiveData.rewardsTokenInformation.map((rawRewardInfo) => ({
            ...rawRewardInfo,
            emissionPerSecond: rawRewardInfo.emissionPerSecond.toString(),
            incentivesLastUpdateTimestamp: Number(rawRewardInfo.incentivesLastUpdateTimestamp),
            tokenIncentivesIndex: rawRewardInfo.tokenIncentivesIndex.toString(),
            emissionEndTimestamp: Number(rawRewardInfo.emissionEndTimestamp),
            rewardPriceFeed: rawRewardInfo.rewardPriceFeed.toString(),
          })),
        },
        vIncentiveData: {
          ...r.vIncentiveData,
          rewardsTokenInformation: r.vIncentiveData.rewardsTokenInformation.map((rawRewardInfo) => ({
            ...rawRewardInfo,
            emissionPerSecond: rawRewardInfo.emissionPerSecond.toString(),
            incentivesLastUpdateTimestamp: Number(rawRewardInfo.incentivesLastUpdateTimestamp),
            tokenIncentivesIndex: rawRewardInfo.tokenIncentivesIndex.toString(),
            emissionEndTimestamp: Number(rawRewardInfo.emissionEndTimestamp),
            rewardPriceFeed: rawRewardInfo.rewardPriceFeed.toString(),
          })),
        },
        sIncentiveData: {
          ...r.sIncentiveData,
          rewardsTokenInformation: r.sIncentiveData.rewardsTokenInformation.map((rawRewardInfo) => ({
            ...rawRewardInfo,
            emissionPerSecond: rawRewardInfo.emissionPerSecond.toString(),
            incentivesLastUpdateTimestamp: Number(rawRewardInfo.incentivesLastUpdateTimestamp),
            tokenIncentivesIndex: rawRewardInfo.tokenIncentivesIndex.toString(),
            emissionEndTimestamp: Number(rawRewardInfo.emissionEndTimestamp),
            rewardPriceFeed: rawRewardInfo.rewardPriceFeed.toString(),
          })),
        },
      })),
      currentTimestamp,
      marketReferencePriceInUsd: baseCurrency.marketReferenceCurrencyPriceInUsd,
      marketReferenceCurrencyDecimals: baseCurrency.marketReferenceCurrencyDecimals,
      reserves: reserves.map((r) => ({
        ...r,
        id: `${chainId}-${r.underlyingAsset}-${lendingPoolAddressProvider}`,
        decimals: Number(r.decimals),
        reserveFactor: r.reserveFactor.toString(),
        baseLTVasCollateral: r.baseLTVasCollateral.toString(),
        averageStableRate: r.averageStableRate.toString(),
        stableDebtLastUpdateTimestamp: Number(r.stableDebtLastUpdateTimestamp),
        liquidityIndex: r.liquidityIndex.toString(),
        reserveLiquidationThreshold: r.reserveLiquidationThreshold.toString(),
        reserveLiquidationBonus: r.reserveLiquidationBonus.toString(),
        variableBorrowIndex: r.variableBorrowIndex.toString(),
        variableBorrowRate: r.variableBorrowRate.toString(),
        availableLiquidity: r.availableLiquidity.toString(),
        stableBorrowRate: r.stableBorrowRate.toString(),
        liquidityRate: r.liquidityRate.toString(),
        totalPrincipalStableDebt: r.totalPrincipalStableDebt.toString(),
        totalScaledVariableDebt: r.totalScaledVariableDebt.toString(),
        borrowCap: r.borrowCap.toString(),
        supplyCap: r.supplyCap.toString(),
        debtCeiling: r.debtCeiling.toString(),
        debtCeilingDecimals: Number(r.debtCeilingDecimals),
        isolationModeTotalDebt: r.isolationModeTotalDebt.toString(),
        unbacked: r.unbacked.toString(),
        priceInMarketReferenceCurrency: r.priceInMarketReferenceCurrency.toString(),
        variableRateSlope1: r.variableRateSlope1.toString(),
        variableRateSlope2: r.variableRateSlope2.toString(),
        stableRateSlope1: r.stableRateSlope1.toString(),
        stableRateSlope2: r.stableRateSlope2.toString(),
        baseStableBorrowRate: r.baseStableBorrowRate.toString(),
        baseVariableBorrowRate: r.baseVariableBorrowRate.toString(),
        optimalUsageRatio: r.optimalUsageRatio.toString(),
        accruedToTreasury: r.accruedToTreasury.toString(),
      })),
    })

    const userSummary = formatUserSummary({
      currentTimestamp,
      marketReferencePriceInUsd: baseCurrency.marketReferenceCurrencyPriceInUsd,
      marketReferenceCurrencyDecimals: baseCurrency.marketReferenceCurrencyDecimals,
      userReserves: rawUserReserves,
      formattedReserves,
      userEmodeCategoryId,
    })

    return {
      rawUserReserves,
      baseCurrency,
      formattedReserves,
      userSummary,
      userEmodeCategoryId,
      timestamp: currentTimestamp,
    }
  }
}

export { aaveDataLayerSelectFnWithCache as aaveDataLayerSelectFn }
