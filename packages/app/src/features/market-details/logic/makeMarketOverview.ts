import { MarketInfo, Reserve } from '@/domain/market-info/marketInfo'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { MarketOverview } from '../types'
import { getReserveEModeCategoryTokens } from './getReserveEModeCategoryTokens'
import { getSparkAirdropDetails } from './getSparkAirdropDetails'

export interface MakeMarketOverviewParams {
  marketInfo: MarketInfo
  reserve: Reserve
}

export function makeMarketOverview({ reserve, marketInfo }: MakeMarketOverviewParams): MarketOverview {
  const eModeCategoryId = reserve.eModeCategory?.id
  const eModeCategoryTokens = getReserveEModeCategoryTokens(marketInfo, reserve)
  const { hasAirdropForBorrowing, hasAirdropForSupplying } = getSparkAirdropDetails({
    marketInfo,
    token: reserve.token.symbol,
  })
  const debt =
    reserve.collateralEligibilityStatus === 'only-in-isolation-mode'
      ? reserve.isolationModeTotalDebt
      : NormalizedUnitNumber(reserve.debtCeiling.minus(reserve.availableDebtCeilingUSD))

  return {
    supply: {
      hasSparkAirdrop: hasAirdropForSupplying,
      status: reserve.supplyAvailabilityStatus,
      totalSupplied: reserve.totalLiquidity,
      supplyCap: reserve.supplyCap,
      apy: reserve.supplyAPY,
    },
    collateral: {
      status: reserve.collateralEligibilityStatus,
      token: reserve.token,
      debtCeiling: reserve.debtCeiling,
      debt,
      maxLtv: reserve.maxLtv,
      liquidationThreshold: reserve.liquidationThreshold,
      liquidationPenalty: reserve.liquidationBonus,
    },
    borrow: {
      hasSparkAirdrop: hasAirdropForBorrowing,
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
            categoryId: eModeCategoryId,
            eModeCategoryTokens,
          },
        }
      : {}),
  }
}
