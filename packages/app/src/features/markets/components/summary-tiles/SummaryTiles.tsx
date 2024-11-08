import { testIds } from '@/ui/utils/testIds'
import { MarketStats } from '../../logic/aggregate-stats'
import { SummaryTile } from '../summary-tile/SummaryTile'

interface SummaryTilesProps {
  marketStats: MarketStats
}

export function SummaryTiles({ marketStats }: SummaryTilesProps) {
  let index = 0
  return (
    <div className="grid grid-cols-2 gap-y-6 sm:flex sm:justify-between lg:gap-8 lg:pr-8">
      <SummaryTile
        variant="total-market-size"
        USDValue={marketStats.totalMarketSizeUSD}
        data-testid={testIds.markets.summary.tile(index++)}
      />
      {marketStats.totalValueLockedUSD && (
        <SummaryTile
          variant="total-value-locked"
          USDValue={marketStats.totalValueLockedUSD}
          data-testid={testIds.markets.summary.tile(index++)}
        />
      )}
      <SummaryTile
        variant="total-available"
        USDValue={marketStats.totalAvailableUSD}
        data-testid={testIds.markets.summary.tile(index++)}
      />
      <SummaryTile
        variant="total-borrows"
        USDValue={marketStats.totalBorrowsUSD}
        data-testid={testIds.markets.summary.tile(index++)}
      />
    </div>
  )
}
