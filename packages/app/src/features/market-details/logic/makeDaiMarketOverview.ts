import { D3MInfo } from '@/domain/d3m-info/types'
import { MarketInfo, Reserve } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { MarketOverview } from '../types'
import { makeMarketOverview } from './makeMarketOverview'

export interface MakeDaiMarketOverviewParams {
  reserve: Reserve
  marketInfo: MarketInfo
  D3MInfo: D3MInfo
}

export function makeDaiMarketOverview({ reserve, marketInfo, D3MInfo }: MakeDaiMarketOverviewParams): MarketOverview {
  const baseOverview = makeMarketOverview({ reserve, marketInfo, airdropEligibleToken: reserve.token.symbol })
  const sDAI = marketInfo.findOneReserveByToken(marketInfo.sDAI)
  const sDaiOverview = makeMarketOverview({ reserve: sDAI, marketInfo, airdropEligibleToken: marketInfo.sDAI.symbol })
  const makerDaoCapacity = NormalizedUnitNumber(D3MInfo.maxDebtCeiling.minus(D3MInfo.D3MCurrentDebtUSD))
  const marketSize = NormalizedUnitNumber(reserve.totalLiquidity.plus(makerDaoCapacity))
  const totalAvailable = NormalizedUnitNumber(marketSize.minus(reserve.totalDebt))
  const utilizationRate = Percentage(reserve.totalDebt.div(marketSize))

  return {
    supply: undefined,
    lend:
      import.meta.env.VITE_FEATURE_DISABLE_DAI_LEND === '1'
        ? undefined
        : {
            status: 'yes',
            token: reserve.token,
            totalLent: reserve.totalLiquidity,
            apy: reserve.supplyAPY,
          },
    collateral: {
      ...sDaiOverview.collateral,
      status: 'yes',
      supplyReplacement: {
        token: sDAI.token,
        totalSupplied: sDAI.totalLiquidity,
        supplyAPY: sDAI.supplyAPY,
      },
    },
    borrow: {
      ...baseOverview.borrow,
      showTokenBadge: true,
    },
    summary: {
      type: 'dai',
      borrowed: reserve.totalDebt,
      instantlyAvailable: reserve.availableLiquidity,
      makerDaoCapacity,
      marketSize,
      totalAvailable,
      utilizationRate,
    },
    ...(sDAI.eModeCategory &&
      (sDAI.eModeCategory.id === 1 || sDAI.eModeCategory.id === 2) && {
        eMode: {
          maxLtv: sDAI.eModeCategory.ltv,
          liquidationThreshold: sDAI.eModeCategory.liquidationThreshold,
          liquidationPenalty: sDAI.eModeCategory.liquidationBonus,
          categoryId: sDAI.eModeCategory.id,
          token: sDAI.token,
          eModeCategoryTokens: sDaiOverview.eMode!.eModeCategoryTokens,
        },
      }),
  }
}
