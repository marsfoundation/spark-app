import { getLiquidationDetails, LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { MarketInfo } from '@/domain/market-info/marketInfo'

export function makeLiquidationDetails(marketInfo: MarketInfo): LiquidationDetails | undefined {
  const alreadyDeposited = {
    tokens: marketInfo.userPositions
      .filter((position) => position.collateralBalance.gt(0) && position.reserve.usageAsCollateralEnabledOnUser)
      .map((position) => position.reserve.token),
    totalValueUSD: marketInfo.userPositionSummary.totalCollateralUSD,
  }
  const alreadyBorrowed = {
    tokens: marketInfo.userPositions
      .filter((position) => position.borrowBalance.gt(0))
      .map((position) => position.reserve.token),
    totalValueUSD: marketInfo.userPositionSummary.totalBorrowsUSD,
  }

  return getLiquidationDetails({
    alreadyDeposited,
    alreadyBorrowed,
    tokensToDeposit: [],
    tokensToBorrow: [],
    marketInfo,
  })
}
