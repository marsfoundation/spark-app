import { withSuspense } from '@/ui/utils/withSuspense'
import { raise } from '@/utils/assert'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { SavingsSkeleton } from './components/skeleton/SavingsSkeleton'
import { useSavings } from './logic/useSavings'
import { GuestView } from './views/GuestView'
import { SavingsDaiAndUSDSView } from './views/SavingsDaiAndUSDSView'
import { SavingsDaiView } from './views/SavingsDaiView'
import { SavingsUSDSView } from './views/SavingsUSDSView'
import { UnsupportedChainView } from './views/UnsupportedChainView'

function SavingsContainer() {
  const { guestMode, openDialog, savingsDetails, openSandboxModal } = useSavings()
  const { openConnectModal = () => {} } = useConnectModal()
  const { openChainModal = () => {} } = useChainModal()

  if (savingsDetails.state === 'unsupported') {
    return (
      <UnsupportedChainView
        openChainModal={openChainModal}
        openConnectModal={openConnectModal}
        openSandboxModal={openChainModal}
        guestMode={guestMode}
      />
    )
  }

  const { sDaiDetails, sUSDSDetails } = savingsDetails
  const APY = sUSDSDetails?.APY ?? sDaiDetails?.APY ?? raise('Savings APY should be defined')

  if (guestMode) {
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
      <SavingsDaiAndUSDSView
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
    return <SavingsUSDSView {...savingsDetails} savingsTokenDetails={sUSDSDetails} openDialog={openDialog} />
  }

  raise('Invalid savings state')
}

const SavingsContainerWithSuspense = withSuspense(SavingsContainer, SavingsSkeleton)
export { SavingsContainerWithSuspense as SavingsContainer }
