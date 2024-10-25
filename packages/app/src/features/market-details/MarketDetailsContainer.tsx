import { useOpenDialog } from '@/domain/state/dialogs'
import { withSuspense } from '@/ui/utils/withSuspense'

import { MarketDetailsSkeleton } from './components/skeleton/MarketDetailsSkeleton'
import { useMarketDetails } from './logic/useMarketDetails'
import { MarketDetailsView } from './views/MarketDetailsView'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

function MarketDetailsContainer() {
  const { setShowAuthFlow } = useDynamicContext()
  const marketDetails = useMarketDetails()
  const openDialog = useOpenDialog()

  return <MarketDetailsView openConnectModal={() => setShowAuthFlow(true)} openDialog={openDialog} {...marketDetails} />
}

const MarketDetailsContainerWithSuspense = withSuspense(MarketDetailsContainer, MarketDetailsSkeleton)
export { MarketDetailsContainerWithSuspense as MarketDetailsContainer }
