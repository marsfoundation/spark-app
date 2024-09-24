import { Farm } from '@/domain/farms/types'
import { Token } from '@/domain/types/Token'
import { DialogContentSkeleton } from '@/features/dialogs/common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '@/features/dialogs/common/views/SuccessView'
import { withSuspense } from '@/ui/utils/withSuspense'
import { useUnstakeDialog } from './logic/useUnstakeDialog'
import { UnstakeView } from './views/UnstakeView'

export interface StakeContainerProps {
  farm: Farm
  initialToken: Token
  closeDialog: () => void
}

function UnstakeDialogContentContainer({ farm, initialToken, closeDialog }: StakeContainerProps) {
  const { selectableAssets, assetsFields, form, stakedToken, objectives, pageStatus, txOverview, actionsContext } =
    useUnstakeDialog({
      farm,
      initialToken,
    })

  console.log({
    selectableAssets,
    assetsFields,
    form,
    stakedToken,
    objectives,
    pageStatus,
    txOverview,
    actionsContext,
  })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        objectiveType="unstake"
        tokenWithValue={stakedToken}
        proceedText="Back to Farm"
        onProceed={closeDialog}
      />
    )
  }

  return (
    <UnstakeView
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

const UnstakeDialogContentContainerWithSuspense = withSuspense(UnstakeDialogContentContainer, DialogContentSkeleton)
export { UnstakeDialogContentContainerWithSuspense as UnstakeDialogContentContainer }
