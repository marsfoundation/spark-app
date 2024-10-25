import { useChainId } from 'wagmi'

import { withSuspense } from '@/ui/utils/withSuspense'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
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
    healthFactorPanelRef,
    riskAcknowledgement,
    actionsContext,
  } = useEasyBorrow()
  const { setShowAuthFlow } = useDynamicContext()

  if (pageStatus.state === 'success') {
    return (
      <SuccessView deposited={tokensToDeposit} borrowed={tokensToBorrow} borrowDetails={borrowDetails} runConfetti />
    )
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
      openConnectModal={() => setShowAuthFlow(true)}
      openSandboxModal={openSandboxModal}
      healthFactorPanelRef={healthFactorPanelRef}
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
