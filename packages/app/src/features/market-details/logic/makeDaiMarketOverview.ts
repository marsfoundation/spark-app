import { D3MInfo } from '@/domain/d3m-info/types'
import { MarketInfo, Reserve } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { CapAutomatorInfo } from '@/domain/cap-automator/types'
import { MarketOverview } from '../types'
import { makeMarketOverview } from './makeMarketOverview'

export interface MakeDaiMarketOverviewParams {
  reserve: Reserve
  marketInfo: MarketInfo
  D3MInfo: D3MInfo
  sDaiCapAutomatorInfo: CapAutomatorInfo
}

export function makeDaiMarketOverview({
  reserve,
  marketInfo,
  D3MInfo,
  sDaiCapAutomatorInfo,
}: MakeDaiMarketOverviewParams): MarketOverview {
  const baseOverview = makeMarketOverview({
    reserve,
    marketInfo,
    capAutomatorInfo: {
      borrowCap: undefined,
      supplyCap: undefined,
    },
  })
  const sDAI = marketInfo.findOneReserveByToken(marketInfo.sDAI)

  const sDaiOverview = makeMarketOverview({
    reserve: sDAI,
    marketInfo,
    capAutomatorInfo: sDaiCapAutomatorInfo,
  })
  const skyCapacity = NormalizedUnitNumber(D3MInfo.maxDebtCeiling.minus(D3MInfo.D3MCurrentDebtUSD))
  const marketSize = NormalizedUnitNumber(reserve.totalLiquidity.plus(skyCapacity))
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
        supplyCap: sDAI.supplyCap,
        capAutomatorInfo: sDaiCapAutomatorInfo.supplyCap,
      },
    },
    borrow: {
      ...baseOverview.borrow,
      showTokenBadge: true,
      capAutomatorInfo: undefined,
    },

    summary: {
      type: 'dai',
      borrowed: reserve.totalDebt,
      instantlyAvailable: reserve.availableLiquidity,
      skyCapacity,
      marketSize,
      totalAvailable,
      utilizationRate,
      dssAutoline: {
        maxDebtCeiling: D3MInfo.maxDebtCeiling,
        gap: D3MInfo.D3MCurrentDebtUSD,
        increaseCooldown: D3MInfo.increaseCooldown,
        lastIncreaseTimestamp: D3MInfo.lastIncreaseTimestamp,
        lastUpdateBlock: D3MInfo.lastUpdateBlock,
      },
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
