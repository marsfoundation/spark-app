import { MakerInfo } from '@/domain/maker-info/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { bigNumberify } from '@/utils/bigNumber'

export interface MarketStats {
  totalMarketSizeUSD: NormalizedUnitNumber
  totalValueLockedUSD: NormalizedUnitNumber | undefined
  totalAvailableUSD: NormalizedUnitNumber
  totalBorrowsUSD: NormalizedUnitNumber
}

export function aggregateStats(marketInfo: MarketInfo, makerInfo: MakerInfo | undefined): MarketStats {
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
  const daiReserve = marketInfo.findReserveBySymbol(TokenSymbol('DAI'))
  const totalValueLockedUSD =
    makerInfo && daiReserve
      ? NormalizedUnitNumber(
          totalAvailableUSD.minus(makerInfo.D3MCurrentDebtUSD.minus(daiReserve.totalVariableDebtUSD)),
        )
      : undefined

  return {
    totalMarketSizeUSD: NormalizedUnitNumber(aggregatedValues.totalLiquidityUSD),
    totalValueLockedUSD,
    totalAvailableUSD: NormalizedUnitNumber(totalAvailableUSD),
    totalBorrowsUSD: NormalizedUnitNumber(aggregatedValues.totalDebtUSD),
  }
}
