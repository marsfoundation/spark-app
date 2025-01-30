import { useUnsupportedChain } from '@/domain/hooks/useUnsupportedChain'
import { withSuspense } from '@/ui/utils/withSuspense'
import { SavingsSkeleton } from './components/skeleton/SavingsSkeleton'
import { useSavings } from './logic/useSavings'
import { SavingsAccountView } from './views/SavingsAccountView'

function SavingsContainer() {
  const { openDialog, selectedAccount } = useSavings()
  const { isGuestMode, openConnectModal, openSandboxModal } = useUnsupportedChain()

  return (
    <SavingsAccountView
      savingsToken={selectedAccount.savingsToken}
      savingsTokenBalance={selectedAccount.savingsTokenBalance}
      underlyingToken={selectedAccount.underlyingToken}
      interestData={selectedAccount.interestData}
      entryAssets={selectedAccount.entryAssets}
      mostValuableAsset={selectedAccount.mostValuableAsset}
      showConvertDialogButton={selectedAccount.showConvertDialogButton}
      chartsData={selectedAccount.chartsData}
      openDialog={openDialog}
      openSandboxModal={openSandboxModal}
      openConnectModal={openConnectModal}
      guestMode={isGuestMode}
      migrationInfo={selectedAccount.migrationInfo}
    />
  )
}

const SavingsContainerWithSuspense = withSuspense(SavingsContainer, SavingsSkeleton)
export { SavingsContainerWithSuspense as SavingsContainer }
