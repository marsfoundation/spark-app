import { Panel } from '@/ui/atoms/panel/Panel'
import { Typography } from '@/ui/atoms/typography/Typography'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { LabeledSwitch } from '@/ui/molecules/labeled-switch/LabeledSwitch'
import { testIds } from '@/ui/utils/testIds'
import { useState } from 'react'
import { MarketsTable } from '../components/markets-table/MarketsTable'
import { SummaryTiles } from '../components/summary-tiles/SummaryTiles'
import { MarketStats } from '../logic/aggregate-stats'
import { MarketEntry } from '../types'

export interface MarketsViewProps {
  marketStats: MarketStats
  activeAndPausedMarketEntries: MarketEntry[]
  frozenMarketEntries: MarketEntry[]
  chainId: number
}
export function MarketsView({
  marketStats,
  activeAndPausedMarketEntries,
  frozenMarketEntries,
  chainId,
}: MarketsViewProps) {
  const [showFrozenAssets, setShowFrozenAssets] = useState(false)
  return (
    <PageLayout className="max-w-6xl gap-8 px-3 lg:px-0">
      <div className="flex flex-row items-center gap-4">
        <Typography variant="h2">Markets</Typography>
      </div>
      <SummaryTiles marketStats={marketStats} />
      <Panel.Wrapper className="flex flex-col gap-5 p-4 lg:p-8">
        <MarketsTable
          entries={activeAndPausedMarketEntries}
          chainId={chainId}
          data-testid={testIds.markets.table.active}
        />
        {frozenMarketEntries.length > 0 && (
          <>
            <LabeledSwitch
              checked={showFrozenAssets}
              onCheckedChange={setShowFrozenAssets}
              data-testid={testIds.markets.frozenAssetsSwitch}
            >
              Show Frozen Assets
            </LabeledSwitch>
            {showFrozenAssets && (
              <MarketsTable
                entries={frozenMarketEntries}
                chainId={chainId}
                hideTableHeader
                data-testid={testIds.markets.table.frozen}
              />
            )}
          </>
        )}
      </Panel.Wrapper>
    </PageLayout>
  )
}
