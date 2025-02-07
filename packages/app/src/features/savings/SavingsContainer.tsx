import { getChainConfigEntry } from '@/config/chain'
import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { useUnsupportedChain } from '@/domain/hooks/useUnsupportedChain'
import { Suspense } from 'react'
import { SavingsSkeleton } from './components/skeleton/SavingsSkeleton'
import { useSavings } from './logic/useSavings'
import { SavingsView } from './views/SavingsView'

function SavingsContainer() {
  const {
    selectedAccount,
    setSelectedAccount,
    allAccounts,
    generalStats,
    openDepositDialog,
    openConvertStablesDialog,
    openSendDialog,
    openWithdrawDialog,
    invalidateSavingsConverterQuery,
    isInSandbox,
  } = useSavings()
  const { isGuestMode, openConnectModal, openSandboxModal } = useUnsupportedChain()

  return (
    <SavingsView
      selectedAccount={selectedAccount}
      allAccounts={allAccounts}
      setSelectedAccount={setSelectedAccount}
      openSandboxModal={openSandboxModal}
      openConnectModal={openConnectModal}
      guestMode={isGuestMode}
      generalStats={generalStats}
      openDepositDialog={openDepositDialog}
      openConvertStablesDialog={openConvertStablesDialog}
      openSendDialog={openSendDialog}
      openWithdrawDialog={openWithdrawDialog}
      invalidateSavingsConverterQuery={invalidateSavingsConverterQuery}
      isInSandbox={isInSandbox}
    />
  )
}

function SavingsContainerWithSuspense() {
  const { chainId } = usePageChainId()
  const chainConfig = getChainConfigEntry(chainId)

  const numberOfAccounts = chainConfig.savings?.accounts?.length ?? 0

  return (
    <Suspense fallback={<SavingsSkeleton numberOfAccounts={numberOfAccounts} />}>
      <SavingsContainer />
    </Suspense>
  )
}
export { SavingsContainerWithSuspense as SavingsContainer }
