import { withSuspense } from '@/ui/utils/withSuspense'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useChainId } from 'wagmi'
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
    borrowDetails,
    guestMode,
    openSandboxModal,
    focusOnActionsPanel,
    riskAcknowledgement,
    actionsContext,
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
      borrowDetails={borrowDetails}
      guestMode={guestMode}
      openConnectModal={openConnectModal}
      openSandboxModal={openSandboxModal}
      focusOnActionsPanel={focusOnActionsPanel}
      riskAcknowledgement={riskAcknowledgement}
      actionsContext={actionsContext}
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
