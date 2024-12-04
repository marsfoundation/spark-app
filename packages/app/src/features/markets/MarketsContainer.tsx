import { withSuspense } from '@/ui/utils/withSuspense'

import { MarketsSkeleton } from './components/skeleton/MarketsSkeleton'
import { useMarkets } from './logic/useMarkets'
import { MarketsView } from './views/MarketsView'

function MarketsContainer() {
  const { marketStats, activeAndPausedMarketEntries, frozenMarketEntries, chainId } = useMarkets()

  return (
    <MarketsView
      marketStats={marketStats}
      activeAndPausedMarketEntries={activeAndPausedMarketEntries}
      frozenMarketEntries={frozenMarketEntries}
      chainId={chainId}
    />
  )
}

const MarketsContainerWithSuspense = withSuspense(MarketsContainer, MarketsSkeleton)
export { MarketsContainerWithSuspense as MarketsContainer }
