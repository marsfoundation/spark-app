import { Farm } from '@/domain/farms/types'
import { DialogContentSkeleton } from '@/features/dialogs/common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '@/features/dialogs/common/views/SuccessView'
import { withSuspense } from '@/ui/utils/withSuspense'
import { useClaimDialog } from './logic/useClaimDialog'
import { ClaimView } from './views/ClaimView'

export interface ClaimContainerProps {
  farm: Farm
  closeDialog: () => void
}

function ClaimDialogContentContainer({ farm, closeDialog }: ClaimContainerProps) {
  const { txOverview, objectives, actionsContext, pageStatus, reward } = useClaimDialog({
    farm,
  })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        objectiveType="claimFarmRewards"
        tokenWithValue={reward}
        proceedText="Back to Farm"
        onProceed={closeDialog}
      />
    )
  }

  return (
    <ClaimView
      objectives={objectives}
      pageStatus={pageStatus}
      txOverview={txOverview}
      actionsContext={actionsContext}
    />
  )
}

const ClaimDialogContentContainerWithSuspense = withSuspense(ClaimDialogContentContainer, DialogContentSkeleton)
export { ClaimDialogContentContainerWithSuspense as ClaimDialogContentContainer }
