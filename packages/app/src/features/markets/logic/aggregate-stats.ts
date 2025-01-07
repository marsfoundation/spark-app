import { D3MInfo } from '@/domain/d3m-info/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { bigNumberify } from '@/utils/bigNumber'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'

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
  const daiAvailable = daiReserve
    ? NormalizedUnitNumber(daiReserve.totalLiquidity.minus(daiReserve.totalVariableDebtUSD))
    : NormalizedUnitNumber(0)
  const D3MProportionInDaiSupply =
    daiReserve && D3MInfo ? Percentage(D3MInfo.D3MCurrentDebtUSD.div(daiReserve.totalLiquidity)) : Percentage(0)

  // Here we assume D3M's share of available DAI is proportional to its share in total supply.
  const totalValueLockedUSD = NormalizedUnitNumber(
    totalAvailableUSD.minus(D3MProportionInDaiSupply.multipliedBy(daiAvailable)),
  )

  return {
    totalMarketSizeUSD: NormalizedUnitNumber(aggregatedValues.totalLiquidityUSD),
    totalValueLockedUSD,
    totalAvailableUSD: NormalizedUnitNumber(totalAvailableUSD),
    totalBorrowsUSD: NormalizedUnitNumber(aggregatedValues.totalDebtUSD),
  }
}
