import { useUnsupportedChain } from '@/domain/hooks/useUnsupportedChain'
import { withSuspense } from '@/ui/utils/withSuspense'
import { raise } from '@/utils/assert'
import { SavingsSkeleton } from './components/skeleton/SavingsSkeleton'
import { useSavings } from './logic/useSavings'
import { GuestView } from './views/GuestView'
import { SavingsDaiAndUsdsView } from './views/SavingsDaiAndUSDSView'
import { SavingsDaiView } from './views/SavingsDaiView'
import { SavingsUsdsView } from './views/SavingsUSDSView'
import { UnsupportedChainView } from './views/UnsupportedChainView'

function SavingsContainer() {
  const { openDialog, savingsDetails } = useSavings()
  const { isGuestMode, openChainModal, openConnectModal, openSandboxModal } = useUnsupportedChain()

  if (savingsDetails.state === 'unsupported') {
    return (
      <UnsupportedChainView
        openChainModal={openChainModal}
        openConnectModal={openConnectModal}
        openSandboxModal={openSandboxModal}
        isGuestMode={isGuestMode}
      />
    )
  }

  const { sDaiDetails, sUSDSDetails } = savingsDetails
  const APY = sUSDSDetails?.APY ?? sDaiDetails?.APY ?? raise('Savings APY should be defined')

  if (isGuestMode) {
    return (
      <GuestView
        {...savingsDetails}
        APY={APY}
        openConnectModal={openConnectModal}
        openSandboxModal={openSandboxModal}
      />
    )
  }

  if (sDaiDetails && sUSDSDetails) {
    return (
      <SavingsDaiAndUsdsView
        {...savingsDetails}
        sDaiDetails={sDaiDetails}
        sUSDSDetails={sUSDSDetails}
        openDialog={openDialog}
      />
    )
  }

  if (sDaiDetails) {
    return <SavingsDaiView {...savingsDetails} savingsTokenDetails={sDaiDetails} openDialog={openDialog} />
  }

  if (sUSDSDetails) {
    return <SavingsUsdsView {...savingsDetails} savingsTokenDetails={sUSDSDetails} openDialog={openDialog} />
  }

  raise('Invalid savings state')
}

const SavingsContainerWithSuspense = withSuspense(SavingsContainer, SavingsSkeleton)
export { SavingsContainerWithSuspense as SavingsContainer }
