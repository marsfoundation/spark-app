import { Farm } from '@/domain/farms/types'
import { DialogContentSkeleton } from '@/features/dialogs/common/components/skeletons/DialogContentSkeleton'
import { withSuspense } from '@/ui/utils/withSuspense'
import { useClaimDialog } from './logic/useClaimDialog'
import { ClaimView } from './views/ClaimView'
import { SuccessView } from './views/SuccessView'

export interface ClaimContainerProps {
  farm: Farm
  closeDialog: () => void
}

function ClaimDialogContentContainer({ farm, closeDialog }: ClaimContainerProps) {
  const { txOverview, objectives, actionsContext, pageStatus } = useClaimDialog({
    farm,
  })

  if (pageStatus.state === 'success') {
    return <SuccessView reward={txOverview.reward} closeDialog={closeDialog} />
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
