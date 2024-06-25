import { useState } from 'react'

import { getChainConfigEntry } from '@/config/chain'
import { Panel } from '@/ui/atoms/panel/Panel'
import { Typography } from '@/ui/atoms/typography/Typography'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { LabeledSwitch } from '@/ui/molecules/labeled-switch/LabeledSwitch'
import { testIds } from '@/ui/utils/testIds'
import { MarketsTable } from '../components/markets-table/MarketsTable'
import { SummaryTiles } from '../components/summary-tiles/SummaryTiles'
import { MarketStats } from '../logic/aggregate-stats'
import { MarketEntry } from '../types'

export interface MarketsViewProps {
  marketStats: MarketStats
  chainName: string
  activeAndPausedMarketEntries: MarketEntry[]
  frozenMarketEntries: MarketEntry[]
  chainId: number
}
export function MarketsView({
  marketStats,
  chainName,
  activeAndPausedMarketEntries,
  frozenMarketEntries,
  chainId,
}: MarketsViewProps) {
  const [showFrozenAssets, setShowFrozenAssets] = useState(false)
  const chainImage = getChainConfigEntry(chainId).meta.logo

  return (
    <PageLayout className="max-w-6xl gap-8 px-3 lg:px-0">
      <div className="flex flex-row items-center gap-4">
        <Typography variant="h2">Markets</Typography>
        <div className="flex translate-y-0.5 flex-row items-center gap-1">
          <img src={chainImage} className="h-5 w-5" />
          <Typography className="font-semibold text-primary text-xs">{chainName}</Typography>
        </div>
      </div>
      <SummaryTiles marketStats={marketStats} data-testid={testIds.markets.summary.container} />
      <Panel.Wrapper className="flex flex-col gap-5 p-4 lg:p-8">
        <MarketsTable entries={activeAndPausedMarketEntries} chainId={chainId} />
        {frozenMarketEntries.length > 0 && (
          <>
            <LabeledSwitch checked={showFrozenAssets} onCheckedChange={setShowFrozenAssets}>
              Show Frozen Assets
            </LabeledSwitch>
            {showFrozenAssets && <MarketsTable entries={frozenMarketEntries} chainId={chainId} hideTableHeader />}
          </>
        )}
      </Panel.Wrapper>
    </PageLayout>
  )
}
