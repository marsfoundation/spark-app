import { useUnsupportedChain } from '@/domain/hooks/useUnsupportedChain'
import { withSuspense } from '@/ui/utils/withSuspense'
import { SavingsSkeleton } from './components/skeleton/SavingsSkeleton'
import { useSavings } from './logic/useSavings'
import { SavingsAccountView } from './views/SavingsAccountView'

function SavingsContainer() {
  const { openDialog, selectedAccount, setSelectedAccount, allAccounts } = useSavings()
  const { isGuestMode, openConnectModal, openSandboxModal } = useUnsupportedChain()

  return (
    <SavingsAccountView
      {...selectedAccount}
      allAccounts={allAccounts}
      setSelectedAccount={setSelectedAccount}
      openDialog={openDialog}
      openSandboxModal={openSandboxModal}
      openConnectModal={openConnectModal}
      guestMode={isGuestMode}
    />
  )
}

const SavingsContainerWithSuspense = withSuspense(SavingsContainer, SavingsSkeleton)
export { SavingsContainerWithSuspense as SavingsContainer }
