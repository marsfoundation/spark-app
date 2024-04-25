import { getLiquidationDetails, LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { MarketInfo } from '@/domain/market-info/marketInfo'

export function makeLiquidationDetails(marketInfo: MarketInfo): LiquidationDetails | undefined {
  const collaterals = marketInfo.userPositions
    .filter((position) => position.collateralBalance.gt(0) && position.reserve.usageAsCollateralEnabledOnUser)
    .map((position) => ({
      token: position.reserve.token,
      value: position.collateralBalance,
    }))
  const borrows = marketInfo.userPositions
    .filter((position) => position.borrowBalance.gt(0))
    .map((position) => ({
      token: position.reserve.token,
      value: position.borrowBalance,
    }))

  return getLiquidationDetails({
    collaterals,
    borrows,
    marketInfo,
    liquidationThreshold: marketInfo.userPositionSummary.currentLiquidationThreshold,
  })
}
