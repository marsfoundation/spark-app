import { MarketStats } from '../../logic/aggregate-stats'
import { SummaryTile } from '../summary-tile/SummaryTile'

interface SummaryTilesProps {
  marketStats: MarketStats
  'data-testid'?: string
}

export function SummaryTiles({ marketStats, 'data-testid': dataTestId }: SummaryTilesProps) {
  let index = -1
  return (
    <div className="grid grid-cols-2 gap-y-6 sm:flex sm:justify-between lg:gap-16 lg:pr-16" data-testid={dataTestId}>
      <SummaryTile variant="total-market-size" USDValue={marketStats.totalMarketSizeUSD} index={index++} />
      {marketStats.totalValueLockedUSD && (
        <SummaryTile variant="total-value-locked" USDValue={marketStats.totalValueLockedUSD} index={index++} />
      )}
      <SummaryTile variant="total-available" USDValue={marketStats.totalAvailableUSD} index={index++} />
      <SummaryTile variant="total-borrows" USDValue={marketStats.totalBorrowsUSD} index={index++} />
    </div>
  )
}
