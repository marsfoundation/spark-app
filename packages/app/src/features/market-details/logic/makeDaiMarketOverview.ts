import { eModeCategoryIdToName } from '@/domain/e-mode/constants'
import { MakerInfo } from '@/domain/maker-info/types'
import { MarketInfo, Reserve } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { MarketOverview } from '../types'
import { makeMarketOverview } from './makeMarketOverview'

export interface MakeDaiMarketOverviewParams {
  reserve: Reserve
  marketInfo: MarketInfo
  makerInfo: MakerInfo
}

export function makeDaiMarketOverview({ reserve, marketInfo, makerInfo }: MakeDaiMarketOverviewParams): MarketOverview {
  const baseOverview = makeMarketOverview({ reserve, marketInfo })
  const sDai = marketInfo.findOneReserveBySymbol(TokenSymbol('sDAI'))
  const sDaiOverview = makeMarketOverview({ reserve: sDai, marketInfo })
  const makerDaoCapacity = NormalizedUnitNumber(makerInfo.maxDebtCeiling.minus(makerInfo.D3MCurrentDebtUSD))
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
        token: sDai.token,
        totalSupplied: sDai.totalLiquidity,
        supplyAPY: sDai.supplyAPY,
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
    ...(sDai.eModeCategory &&
      (sDai.eModeCategory.id === 1 || sDai.eModeCategory.id === 2) && {
        eMode: {
          maxLtv: sDai.eModeCategory.ltv,
          liquidationThreshold: sDai.eModeCategory.liquidationThreshold,
          liquidationPenalty: sDai.eModeCategory.liquidationBonus,
          category: eModeCategoryIdToName[sDai.eModeCategory.id],
          token: sDai.token,
          eModeCategoryTokens: sDaiOverview.eMode!.eModeCategoryTokens,
        },
      }),
  }
}
