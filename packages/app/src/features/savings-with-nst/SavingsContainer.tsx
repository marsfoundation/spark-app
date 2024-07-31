import { SavingsSkeleton } from '@/features/savings/components/skeleton/SavingsSkeleton'
import { GuestView } from '@/features/savings/views/GuestView'
import { UnsupportedChainView } from '@/features/savings/views/UnsupportedChainView'
import { withSuspense } from '@/ui/utils/withSuspense'
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

  const { originChainId, assetsInWallet, maxBalanceToken, totalEligibleCashUSD, state, ...savingTokensDetails } =
    savingsDetails
  const APY = 'sNST' in savingTokensDetails ? savingTokensDetails.sNST.APY : savingTokensDetails.sDai.APY

  if (guestMode) {
    return (
      <GuestView
        APY={APY}
        chainId={originChainId}
        openConnectModal={openConnectModal}
        openSandboxModal={openSandboxModal}
      />
    )
  }

  if ('sDai' in savingTokensDetails && 'sNST' in savingTokensDetails) {
    return (
      <SavingsDaiAndNSTView
        sDaiDetails={savingTokensDetails.sDai}
        sNSTDetails={savingTokensDetails.sNST}
        chainId={originChainId}
        assetsInWallet={assetsInWallet}
        maxBalanceToken={maxBalanceToken}
        totalEligibleCashUSD={totalEligibleCashUSD}
        openDialog={openDialog}
      />
    )
  }

  if ('sDai' in savingTokensDetails) {
    return (
      <SavingsDaiView
        savingsTokenDetails={savingTokensDetails.sDai}
        chainId={originChainId}
        assetsInWallet={assetsInWallet}
        maxBalanceToken={maxBalanceToken}
        totalEligibleCashUSD={totalEligibleCashUSD}
        openDialog={openDialog}
      />
    )
  }

  return (
    <SavingsNSTView
      savingsTokenDetails={savingTokensDetails.sNST}
      chainId={originChainId}
      assetsInWallet={assetsInWallet}
      maxBalanceToken={maxBalanceToken}
      totalEligibleCashUSD={totalEligibleCashUSD}
      openDialog={openDialog}
    />
  )
}

const SavingsContainerWithSuspense = withSuspense(SavingsContainer, SavingsSkeleton)
export { SavingsContainerWithSuspense as SavingsContainer }
