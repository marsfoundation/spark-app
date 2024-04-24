import { withSuspense } from '@/ui/utils/withSuspense'

import { DialogContentSkeleton } from '../common/components/skeletons/DialogContentSkeleton'
import { DialogContentContainerProps } from '../common/types'
import { SuccessView } from '../common/views/SuccessView'
import { useWithdrawDialog } from './logic/useWithdrawDialog'
import { WithdrawView } from './views/WithdrawView'

function WithdrawDialogContentContainer({ token, closeDialog }: DialogContentContainerProps) {
  const {
    objectives,
    withdrawOptions,
    assetsToWithdrawFields,
    pageStatus,
    form,
    withdrawAsset,
    currentPositionOverview,
    updatedPositionOverview,
  } = useWithdrawDialog({ initialToken: token })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        objectiveType="withdraw"
        tokenWithValue={withdrawAsset}
        onProceed={closeDialog}
        proceedText="View in dashboard"
      />
    )
  }

  return (
    <WithdrawView
      withdrawOptions={withdrawOptions}
      objectives={objectives}
      form={form}
      assetsToWithdrawFields={assetsToWithdrawFields}
      pageStatus={pageStatus}
      withdrawAsset={withdrawAsset}
      currentPositionOverview={currentPositionOverview}
      updatedPositionOverview={updatedPositionOverview}
    />
  )
}

const WithdrawDialogContentContainerWithSuspense = withSuspense(WithdrawDialogContentContainer, DialogContentSkeleton)
export { WithdrawDialogContentContainerWithSuspense as WithdrawDialogContentContainer }
