import { useConnectModal } from '@rainbow-me/rainbowkit'

import { useOpenDialog } from '@/domain/state/dialogs'
import { withSuspense } from '@/ui/utils/withSuspense'

import { DashboardSkeleton } from './components/skeleton/DashboardSkeleton'
import { useDashboard } from './logic/useDashboard'
import { GuestView } from './views/GuestView'
import { PositionView } from './views/PositionView'

function DashboardContainer() {
  const {
    positionSummary,
    deposits,
    borrows,
    walletComposition,
    eModeCategoryId,
    guestMode,
    liquidationDetails,
    openSandboxModal,
  } = useDashboard()
  const { openConnectModal = () => {} } = useConnectModal()
  const openDialog = useOpenDialog()

  if (guestMode) {
    return <GuestView openConnectModal={openConnectModal} openSandboxModal={openSandboxModal} />
  }

  return (
    <PositionView
      positionSummary={positionSummary}
      deposits={deposits}
      borrows={borrows}
      walletComposition={walletComposition}
      eModeCategoryId={eModeCategoryId}
      openDialog={openDialog}
      liquidationDetails={liquidationDetails}
    />
  )
}

const DashboardContainerWithSuspense = withSuspense(DashboardContainer, DashboardSkeleton)
export { DashboardContainerWithSuspense as DashboardContainer }
