import { useConnectModal } from '@rainbow-me/rainbowkit'

import { useOpenDialog } from '@/domain/state/dialogs'
import { withSuspense } from '@/ui/utils/withSuspense'

import { MarketDetailsSkeleton } from './components/skeleton/MarketDetailsSkeleton'
import { useMarketDetails } from './logic/useMarketDetails'
import { MarketDetailsView } from './views/MarketDetailsView'

function MarketDetailsContainer() {
  const { openConnectModal = () => {} } = useConnectModal()
  const marketDetails = useMarketDetails()
  const openDialog = useOpenDialog()

  return <MarketDetailsView openConnectModal={openConnectModal} openDialog={openDialog} {...marketDetails} />
}

const MarketDetailsContainerWithSuspense = withSuspense(MarketDetailsContainer, MarketDetailsSkeleton)
export { MarketDetailsContainerWithSuspense as MarketDetailsContainer }
