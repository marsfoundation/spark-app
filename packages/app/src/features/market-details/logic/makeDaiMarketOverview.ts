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
  const baseOverview = makeMarketOverview({
    reserve,
    marketInfo,
    capAutomatorInfo: {
      borrowCap: undefined,
      supplyCap: undefined,
    },
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
    collateral: baseOverview.collateral,
    borrow: {
      ...baseOverview.borrow,
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
    eMode: baseOverview.eMode,
  }
}
