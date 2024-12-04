import { D3MInfo } from '@/domain/d3m-info/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { bigNumberify } from '@/utils/bigNumber'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface MarketStats {
  totalMarketSizeUSD: NormalizedUnitNumber
  totalValueLockedUSD: NormalizedUnitNumber | undefined
  totalAvailableUSD: NormalizedUnitNumber
  totalBorrowsUSD: NormalizedUnitNumber
}

export function aggregateStats(marketInfo: MarketInfo, D3MInfo: D3MInfo | undefined): MarketStats {
  const aggregatedValues = marketInfo.reserves.reduce(
    (acc, reserve) => {
      acc.totalDebtUSD = acc.totalDebtUSD.plus(reserve.totalDebtUSD)
      acc.totalLiquidityUSD = acc.totalLiquidityUSD.plus(reserve.totalLiquidityUSD)
      return acc
    },
    {
      totalLiquidityUSD: bigNumberify(0),
      totalDebtUSD: bigNumberify(0),
    },
  )
  const totalAvailableUSD = aggregatedValues.totalLiquidityUSD.minus(aggregatedValues.totalDebtUSD)
  const daiReserve = marketInfo.findReserveByToken(marketInfo.DAI)
  const totalValueLockedUSD =
    D3MInfo && daiReserve
      ? NormalizedUnitNumber(totalAvailableUSD.minus(D3MInfo.D3MCurrentDebtUSD.minus(daiReserve.totalVariableDebtUSD)))
      : undefined

  return {
    totalMarketSizeUSD: NormalizedUnitNumber(aggregatedValues.totalLiquidityUSD),
    totalValueLockedUSD,
    totalAvailableUSD: NormalizedUnitNumber(totalAvailableUSD),
    totalBorrowsUSD: NormalizedUnitNumber(aggregatedValues.totalDebtUSD),
  }
}
