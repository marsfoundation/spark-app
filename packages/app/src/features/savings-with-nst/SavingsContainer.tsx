import { SavingsSkeleton } from '@/features/savings/components/skeleton/SavingsSkeleton'
import { GuestView } from '@/features/savings/views/GuestView'
import { UnsupportedChainView } from '@/features/savings/views/UnsupportedChainView'
import { withSuspense } from '@/ui/utils/withSuspense'
import { raise } from '@/utils/assert'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useSavings } from './logic/useSavings'
import { SavingsDaiAndNSTView } from './views/SavingsDaiAndNSTView'
import { SavingsDaiView } from './views/SavingsDaiView'
import { SavingsNSTView } from './views/SavingsNSTView'

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

  const { sDaiDetails, sNSTDetails } = savingsDetails
  const APY = sNSTDetails?.APY ?? sDaiDetails?.APY ?? raise('Savings APY should be defined')

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

  if (sDaiDetails && sNSTDetails) {
    return (
      <SavingsDaiAndNSTView
        {...savingsDetails}
        sDaiDetails={sDaiDetails}
        sNSTDetails={sNSTDetails}
        openDialog={openDialog}
      />
    )
  }

  if (sDaiDetails) {
    return <SavingsDaiView {...savingsDetails} savingsTokenDetails={sDaiDetails} openDialog={openDialog} />
  }

  if (sNSTDetails) {
    return <SavingsNSTView {...savingsDetails} savingsTokenDetails={sNSTDetails} openDialog={openDialog} />
  }

  raise('Invalid savings state')
}

const SavingsContainerWithSuspense = withSuspense(SavingsContainer, SavingsSkeleton)
export { SavingsContainerWithSuspense as SavingsContainer }
