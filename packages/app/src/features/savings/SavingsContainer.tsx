import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'

import { withSuspense } from '@/ui/utils/withSuspense'

import { SavingsSkeleton } from './components/skeleton/SavingsSkeleton'
import { useSavings } from './logic/useSavings'
import { GuestView } from './views/GuestView'
import { SavingsView } from './views/SavingsView'
import { UnsupportedChainView } from './views/UnsupportedChainView'

function SavingsContainer() {
  const { guestMode, openDialog, savingsDetails } = useSavings()
  const { openConnectModal = () => {} } = useConnectModal()
  const { openChainModal = () => {} } = useChainModal()

  if (savingsDetails.state === 'unsupported') {
    return (
      <UnsupportedChainView openChainModal={openChainModal} openConnectModal={openConnectModal} guestMode={guestMode} />
    )
  }

  const {
    APY,
    chainId,
    depositedUSD,
    depositedUSDPrecision,
    sDAIBalance,
    currentProjections,
    opportunityProjections,
    assetsInWallet,
    maxBalanceToken,
    totalEligibleCashUSD,
  } = savingsDetails

  if (guestMode) {
    return <GuestView APY={APY} chainId={chainId} openConnectModal={openConnectModal} />
  }

  return (
    <SavingsView
      APY={APY}
      chainId={chainId}
      depositedUSD={depositedUSD}
      depositedUSDPrecision={depositedUSDPrecision}
      sDAIBalance={sDAIBalance}
      currentProjections={currentProjections}
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
