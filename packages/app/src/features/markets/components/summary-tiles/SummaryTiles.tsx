import { testIds } from '@/ui/utils/testIds'
import { MarketStats } from '../../logic/aggregate-stats'
import { SummaryTile } from './SummaryTile'

interface SummaryTilesProps {
  marketStats: MarketStats
}

export function SummaryTiles({ marketStats }: SummaryTilesProps) {
  let index = 0
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-5">
      <SummaryTile
        title="Total Market Size"
        USDValue={marketStats.totalMarketSizeUSD}
        data-testid={testIds.markets.summary.tile(index++)}
        fancy
      />
      {marketStats.totalValueLockedUSD && (
        <SummaryTile
          title="Total Value Locked"
          USDValue={marketStats.totalValueLockedUSD}
          data-testid={testIds.markets.summary.tile(index++)}
        />
      )}
      <SummaryTile
        title="Total Available"
        USDValue={marketStats.totalAvailableUSD}
        data-testid={testIds.markets.summary.tile(index++)}
      />
      <SummaryTile
        title="Total Borrows"
        USDValue={marketStats.totalBorrowsUSD}
        data-testid={testIds.markets.summary.tile(index++)}
      />
    </div>
  )
}
