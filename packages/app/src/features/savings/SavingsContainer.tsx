import { useConnectModal } from '@rainbow-me/rainbowkit'

import { withSuspense } from '@/ui/utils/withSuspense'

import { SavingsSkeleton } from './components/skeleton/SavingsSkeleton'
import { useSavings } from './logic/useSavings'
import { GuestView } from './views/GuestView'
import { SavingsView } from './views/SavingsView'

function SavingsContainer() {
  const { guestMode, openDialog, savingsDetails } = useSavings()
  const { openConnectModal = () => {} } = useConnectModal()

  const {
    DSR,
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
    return <GuestView DSR={DSR} openConnectModal={openConnectModal} />
  }

  return (
    <SavingsView
      DSR={DSR}
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
