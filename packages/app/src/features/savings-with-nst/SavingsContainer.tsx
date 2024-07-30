import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'

import { withSuspense } from '@/ui/utils/withSuspense'

import { SavingsSkeleton } from '@/features/savings/components/skeleton/SavingsSkeleton'
import { GuestView } from '@/features/savings/views/GuestView'
import { UnsupportedChainView } from '@/features/savings/views/UnsupportedChainView'
import { useSavings } from './logic/useSavings'
import { SavingsView } from './views/SavingsView'

function SavingsContainer() {
  const { guestMode, openDialog, savingsDetails: savingsDaiDetails, openSandboxModal } = useSavings()
  const { openConnectModal = () => {} } = useConnectModal()
  const { openChainModal = () => {} } = useChainModal()

  if (savingsDaiDetails.state === 'unsupported') {
    return (
      <UnsupportedChainView
        openChainModal={openChainModal}
        openConnectModal={openConnectModal}
        openSandboxModal={openChainModal}
        guestMode={guestMode}
      />
    )
  }

  const {
    APY,
    chainId,
    depositedUSD,
    depositedUSDPrecision,
    sDaiWithBalance,
    currentProjections,
    opportunityProjections,
    assetsInWallet,
    maxBalanceToken,
    totalEligibleCashUSD,
  } = savingsDaiDetails

  if (guestMode) {
    return (
      <GuestView APY={APY} chainId={chainId} openConnectModal={openConnectModal} openSandboxModal={openSandboxModal} />
    )
  }

  return (
    <SavingsView
      APY={APY}
      chainId={chainId}
      depositedUSD={depositedUSD}
      depositedUSDPrecision={depositedUSDPrecision}
      sDaiWithBalance={sDaiWithBalance}
      currentSDaiProjections={currentProjections}
      opportunityProjections={opportunityProjections}
      assetsInWallet={assetsInWallet}
      maxBalanceToken={maxBalanceToken}
      totalEligibleCashUSD={totalEligibleCashUSD}
      openDialog={openDialog}
    />
  )
}

const SavingsContainerWithSuspense = withSuspense(SavingsContainer, SavingsSkeleton)
export { SavingsContainerWithSuspense as SavingsContainer }
