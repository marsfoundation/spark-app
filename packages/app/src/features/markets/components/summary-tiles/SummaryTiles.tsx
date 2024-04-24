import { MarketStats } from '../../logic/aggregate-stats'
import { SummaryTile } from '../summary-tile/SummaryTile'

interface SummaryTilesProps {
  marketStats: MarketStats
}

export function SummaryTiles({ marketStats }: SummaryTilesProps) {
  return (
    <div className="grid grid-cols-2 gap-y-6 sm:flex sm:justify-between lg:gap-16 lg:pr-16">
      <SummaryTile variant="total-market-size" USDValue={marketStats.totalMarketSizeUSD} />
      {marketStats.totalValueLockedUSD && (
        <SummaryTile variant="total-value-locked" USDValue={marketStats.totalValueLockedUSD} />
      )}
      <SummaryTile variant="total-available" USDValue={marketStats.totalAvailableUSD} />
      <SummaryTile variant="total-borrows" USDValue={marketStats.totalBorrowsUSD} />
    </div>
  )
}
