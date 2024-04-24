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

import { getContractAddress } from '../../hooks/useContractAddress'

export interface AaveDataLayerArgs {
  wagmiConfig: Config
  chainId: number
  account?: Address
}

export type AaveData = Awaited<ReturnType<ReturnType<typeof aaveDataLayer>['queryFn']>>
export type AaveUserSummary = AaveData['userSummary']
export type AaveUserReserve = AaveUserSummary['userReservesData'][number]['reserve']
export type RawAaveUserReserve = AaveData['rawUserReserves'][number]
export type AaveFormattedReserve = AaveData['formattedReserves'][number]
export type AaveBaseCurrency = AaveData['baseCurrency']
export type AaveUserSummaryReservesData = AaveUserSummary['userReservesData']

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function aaveDataLayer({ wagmiConfig, chainId, account }: AaveDataLayerArgs) {
  const uiPoolDataProvider = getContractAddress(uiPoolDataProviderAddress, chainId)
  const lendingPoolAddressProvider = getContractAddress(lendingPoolAddressProviderAddress, chainId)
  const uiIncentiveDataProvider = getContractAddress(uiIncentiveDataProviderAddress, chainId)

  const queryKey = ['reserves', account, chainId]

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function queryFn() {
    const data = await multicall(wagmiConfig, {
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

    const [[reserves, baseCurrencyInfo], reservesIncentiveData, [userReserves, userEmodeCategoryId]] = data

    const currentTimestamp = Math.floor(Date.now() / 1000)

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

  return {
    queryKey,
    queryFn,
  }
}
