import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useChainId } from 'wagmi'

import { withSuspense } from '@/ui/utils/withSuspense'

import { EasyBorrowSkeleton } from './components/skeleton/EasyBorrowSkeleton'
import { useEasyBorrow } from './logic/useEasyBorrow'
import { EasyBorrowView } from './views/EasyBorrowView'
import { SuccessView } from './views/SuccessView'

function EasyBorrowContainer() {
  const {
    form,
    assetsToDepositFields,
    assetsToBorrowFields,
    updatedPositionSummary,
    setDesiredLoanToValue,
    liquidationDetails,
    pageStatus,
    actions,
    tokensToDeposit,
    tokensToBorrow,
    alreadyDeposited,
    alreadyBorrowed,
    assetToBorrow,
    guestMode,
    healthFactorPanelRef,
  } = useEasyBorrow()
  const { openConnectModal = () => {} } = useConnectModal()

  if (pageStatus.state === 'success') {
    return <SuccessView deposited={tokensToDeposit} borrowed={tokensToBorrow} runConfetti />
  }

  return (
    <EasyBorrowView
      pageStatus={pageStatus}
      form={form}
      assetsToBorrowFields={assetsToBorrowFields}
      assetsToDepositFields={assetsToDepositFields}
      alreadyDeposited={alreadyDeposited}
      alreadyBorrowed={alreadyBorrowed}
      updatedPositionSummary={updatedPositionSummary}
      setDesiredLoanToValue={setDesiredLoanToValue}
      liquidationDetails={liquidationDetails}
      objectives={actions}
      assetToBorrow={assetToBorrow}
      guestMode={guestMode}
      openConnectModal={openConnectModal}
      healthFactorPanelRef={healthFactorPanelRef}
    />
  )
}

// @note: forces form to reset when network changes
function EasyBorrowContainerWithKey() {
  const chainId = useChainId()
  return <EasyBorrowContainer key={chainId} />
}

const EasyBorrowContainerWithSuspense = withSuspense(EasyBorrowContainerWithKey, EasyBorrowSkeleton)

export { EasyBorrowContainerWithSuspense as EasyBorrowContainer }
