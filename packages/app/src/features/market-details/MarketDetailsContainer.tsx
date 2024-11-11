import { withSuspense } from '@/ui/utils/withSuspense'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { MarketDetailsSkeleton } from './components/skeleton/MarketDetailsSkeleton'
import { useMarketDetails } from './logic/useMarketDetails'
import { MarketDetailsView } from './views/MarketDetailsView'

function MarketDetailsContainer() {
  const { openConnectModal = () => {} } = useConnectModal()
  const marketDetails = useMarketDetails()

  return <MarketDetailsView openConnectModal={openConnectModal} {...marketDetails} />
}

const MarketDetailsContainerWithSuspense = withSuspense(MarketDetailsContainer, MarketDetailsSkeleton)
export { MarketDetailsContainerWithSuspense as MarketDetailsContainer }
