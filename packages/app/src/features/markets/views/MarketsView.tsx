import { NetworkBadge } from '@/ui/atoms/new/network-badge/NetworkBadge'
import { Panel } from '@/ui/atoms/new/panel/Panel'
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
    <PageLayout className="gap-8">
      <div className="flex flex-row items-center gap-4">
        <h1 className="typography-heading-1 text-primary">Markets</h1>
        <NetworkBadge chainId={chainId} />
      </div>
      <SummaryTiles marketStats={marketStats} />
      <Panel className="flex flex-col gap-5">
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
      </Panel>
    </PageLayout>
  )
}
