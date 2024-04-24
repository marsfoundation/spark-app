import { withSuspense } from '@/ui/utils/withSuspense'

import { DialogContentSkeleton } from '../common/components/skeletons/DialogContentSkeleton'
import { DialogContentContainerProps } from '../common/types'
import { SuccessView } from '../common/views/SuccessView'
import { useDepositDialog } from './logic/useDepositDialog'
import { DepositView } from './views/DepositView'

function DepositDialogContentContainer({ token, closeDialog }: DialogContentContainerProps) {
  const {
    objectives,
    depositableAssets,
    assetsToDepositFields,
    pageStatus,
    form,
    tokenToDeposit,
    currentPositionOverview,
    updatedPositionOverview,
  } = useDepositDialog({
    initialToken: token,
  })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        objectiveType="deposit"
        tokenWithValue={tokenToDeposit}
        onProceed={closeDialog}
        proceedText="View in dashboard"
      />
    )
  }

  return (
    <DepositView
      initialToken={token}
      selectableAssets={depositableAssets}
      objectives={objectives}
      form={form}
      assetsFields={assetsToDepositFields}
      pageStatus={pageStatus}
      currentPositionOverview={currentPositionOverview}
      updatedPositionOverview={updatedPositionOverview}
    />
  )
}

const DepositDialogContentContainerWithSuspense = withSuspense(DepositDialogContentContainer, DialogContentSkeleton)
export { DepositDialogContentContainerWithSuspense as DepositDialogContentContainer }
