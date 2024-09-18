import { Farm } from '@/domain/farms/types'
import { Token } from '@/domain/types/Token'
import { DialogContentSkeleton } from '@/features/dialogs/common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '@/features/dialogs/common/views/SuccessView'
import { withSuspense } from '@/ui/utils/withSuspense'
import { useStakeDialog } from './logic/useStakeDialog'
import { StakeView } from './views/StakeView'

export interface StakeContainerProps {
  farm: Farm
  initialToken?: Token
  closeDialog: () => void
}

function StakeDialogContentContainer({ farm, initialToken, closeDialog }: StakeContainerProps) {
  const { selectableAssets, assetsFields, form, stakedToken, objectives, pageStatus, txOverview, actionsContext } =
    useStakeDialog({
      farm,
      initialToken,
    })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        objectiveType="deposit"
        tokenWithValue={stakedToken}
        proceedText="Back to Farm"
        onProceed={closeDialog}
      />
    )
  }

  return (
    <StakeView
      form={form}
      selectableAssets={selectableAssets}
      assetsFields={assetsFields}
      objectives={objectives}
      pageStatus={pageStatus}
      txOverview={txOverview}
      farm={farm}
      actionsContext={actionsContext}
    />
  )
}

const StakeDialogContentContainerWithSuspense = withSuspense(StakeDialogContentContainer, DialogContentSkeleton)
export { StakeDialogContentContainerWithSuspense as StakeDialogContentContainer }
