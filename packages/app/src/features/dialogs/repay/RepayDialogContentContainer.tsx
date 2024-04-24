import { withSuspense } from '@/ui/utils/withSuspense'

import { DialogContentSkeleton } from '../common/components/skeletons/DialogContentSkeleton'
import { DialogContentContainerProps } from '../common/types'
import { SuccessView } from '../common/views/SuccessView'
import { useRepayDialog } from './logic/useRepayDialog'
import { RepayView } from './views/RepayView'

function RepayDialogContentContainer({ token, closeDialog }: DialogContentContainerProps) {
  const {
    objectives,
    repayOptions,
    assetsToRepayFields,
    pageStatus,
    form,
    repaymentAsset,
    currentPositionOverview,
    updatedPositionOverview,
  } = useRepayDialog({ initialToken: token })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        objectiveType="repay"
        tokenWithValue={repaymentAsset}
        onProceed={closeDialog}
        proceedText="View in dashboard"
      />
    )
  }

  return (
    <RepayView
      debtAsset={token}
      repayOptions={repayOptions}
      objectives={objectives}
      form={form}
      assetsToRepayFields={assetsToRepayFields}
      pageStatus={pageStatus}
      currentPositionOverview={currentPositionOverview}
      updatedPositionOverview={updatedPositionOverview}
    />
  )
}

const RepayDialogContentContainerWithSuspense = withSuspense(RepayDialogContentContainer, DialogContentSkeleton)
export { RepayDialogContentContainerWithSuspense as RepayDialogContentContainer }
