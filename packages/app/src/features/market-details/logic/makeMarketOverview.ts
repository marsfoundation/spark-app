import { eModeCategoryIdToName } from '@/domain/e-mode/constants'
import { MarketInfo, Reserve } from '@/domain/market-info/marketInfo'

import { MarketOverview } from '../types'
import { getReserveEModeCategoryTokens } from './getReserveEModeCategoryTokens'

export interface MakeMarketOverviewParams {
  marketInfo: MarketInfo
  reserve: Reserve
}

export function makeMarketOverview({ reserve, marketInfo }: MakeMarketOverviewParams): MarketOverview {
  const eModeCategoryId = reserve.eModeCategory?.id
  const eModeCategoryTokens = getReserveEModeCategoryTokens(marketInfo, reserve)

  return {
    supply: {
      status: reserve.supplyAvailabilityStatus,
      totalSupplied: reserve.totalLiquidity,
      supplyCap: reserve.supplyCap,
      apy: reserve.supplyAPY,
    },
    collateral: {
      status: reserve.collateralEligibilityStatus,
      token: reserve.token,
      debtCeiling: reserve.debtCeiling,
      debt: reserve.totalDebt,
      maxLtv: reserve.maxLtv,
      liquidationThreshold: reserve.liquidationThreshold,
      liquidationPenalty: reserve.liquidationBonus,
    },
    borrow: {
      status: reserve.borrowEligibilityStatus,
      totalBorrowed: reserve.totalDebt,
      borrowCap: reserve.borrowCap,
      apy: reserve.variableBorrowApy,
      reserveFactor: reserve.reserveFactor,
      chartProps: {
        utilizationRate: reserve.utilizationRate,
        optimalUtilizationRate: reserve.optimalUtilizationRate,
        variableRateSlope1: reserve.variableRateSlope1,
        variableRateSlope2: reserve.variableRateSlope2,
        baseVariableBorrowRate: reserve.baseVariableBorrowRate,
      },
    },
    summary: {
      type: 'default',
      marketSize: reserve.totalLiquidity,
      utilizationRate: reserve.utilizationRate,
      borrowed: reserve.totalDebt,
      available: reserve.availableLiquidity,
    },
    ...(eModeCategoryId === 1 || eModeCategoryId === 2
      ? {
          eMode: {
            maxLtv: reserve.eModeCategory!.ltv,
            liquidationThreshold: reserve.eModeCategory!.liquidationThreshold,
            liquidationPenalty: reserve.eModeCategory!.liquidationBonus,
            category: eModeCategoryIdToName[eModeCategoryId],
            eModeCategoryTokens,
          },
        }
      : {}),
  }
}
