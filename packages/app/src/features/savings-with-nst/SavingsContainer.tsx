import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'

import { withSuspense } from '@/ui/utils/withSuspense'

import { SavingsSkeleton } from '@/features/savings/components/skeleton/SavingsSkeleton'
import { GuestView } from '@/features/savings/views/GuestView'
import { UnsupportedChainView } from '@/features/savings/views/UnsupportedChainView'
import { useSavings } from './logic/useSavings'
import { SavingsView } from './views/SavingsView'

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

  const { chainId, assetsInWallet, maxBalanceToken, totalEligibleCashUSD, state, ...savingTokensDetails } =
    savingsDetails
  const APY = 'sNST' in savingTokensDetails ? savingTokensDetails.sNST.APY : savingTokensDetails.sDai.APY

  if (guestMode) {
    return (
      <GuestView APY={APY} chainId={chainId} openConnectModal={openConnectModal} openSandboxModal={openSandboxModal} />
    )
  }

  return (
    <SavingsView
      chainId={chainId}
      assetsInWallet={assetsInWallet}
      maxBalanceToken={maxBalanceToken}
      totalEligibleCashUSD={totalEligibleCashUSD}
      openDialog={openDialog}
      {...savingTokensDetails}
    />
  )
}

const SavingsContainerWithSuspense = withSuspense(SavingsContainer, SavingsSkeleton)
export { SavingsContainerWithSuspense as SavingsContainer }
