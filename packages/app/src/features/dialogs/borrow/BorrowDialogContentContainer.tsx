import { withSuspense } from '@/ui/utils/withSuspense'

import { DialogContentSkeleton } from '../common/components/skeletons/DialogContentSkeleton'
import { DialogContentContainerProps } from '../common/types'
import { SuccessView } from '../common/views/SuccessView'
import { useBorrowDialog } from './logic/useBorrowDialog'
import { BorrowView } from './views/BorrowView'

function BorrowDialogContentContainer({ token, closeDialog }: DialogContentContainerProps) {
  const {
    objectives,
    borrowOptions,
    assetsToBorrowFields,
    pageStatus,
    form,
    tokenToBorrow,
    currentHealthFactor,
    updatedHealthFactor,
    riskAcknowledgement,
    actionsContext,
  } = useBorrowDialog({
    initialToken: token,
  })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        objectiveType="borrow"
        tokenWithValue={tokenToBorrow}
        onProceed={closeDialog}
        proceedText="View in dashboard"
      />
    )
  }

  return (
    <BorrowView
      selectableAssets={borrowOptions}
      objectives={objectives}
      actionsContext={actionsContext}
      form={form}
      assetsFields={assetsToBorrowFields}
      pageStatus={pageStatus}
      borrowAsset={tokenToBorrow}
      currentHealthFactor={currentHealthFactor}
      updatedHealthFactor={updatedHealthFactor}
      riskAcknowledgement={riskAcknowledgement}
    />
  )
}

const BorrowDialogContentContainerWithSuspense = withSuspense(BorrowDialogContentContainer, DialogContentSkeleton)
export { BorrowDialogContentContainerWithSuspense as BorrowDialogContentContainer }
