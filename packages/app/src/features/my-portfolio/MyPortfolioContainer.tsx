import { useConnectModal } from '@rainbow-me/rainbowkit'

import { useOpenDialog } from '@/domain/state/dialogs'
import { withSuspense } from '@/ui/utils/withSuspense'

import { MyPortfolioSkeleton } from './components/skeleton/MyPortfolioSkeleton'
import { useMyPortfolio } from './logic/useMyPortfolio'
import { GuestView } from './views/GuestView'
import { PositionView } from './views/PositionView'

function MyPortfolioContainer() {
  const {
    positionSummary,
    deposits,
    borrows,
    walletComposition,
    eModeCategoryId,
    guestMode,
    liquidationDetails,
    openSandboxModal,
  } = useMyPortfolio()
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

const MyPortfolioContainerWithSuspense = withSuspense(MyPortfolioContainer, MyPortfolioSkeleton)
export { MyPortfolioContainerWithSuspense as MyPortfolioContainer }
