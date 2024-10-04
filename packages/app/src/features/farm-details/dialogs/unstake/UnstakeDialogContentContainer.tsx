import { Farm } from '@/domain/farms/types'
import { Token } from '@/domain/types/Token'
import { DialogContentSkeleton } from '@/features/dialogs/common/components/skeletons/DialogContentSkeleton'
import { withSuspense } from '@/ui/utils/withSuspense'
import { useUnstakeDialog } from './logic/useUnstakeDialog'
import { SuccessView } from './views/SuccessView'
import { UnstakeView } from './views/UnstakeView'

export interface StakeContainerProps {
  farm: Farm
  initialToken: Token
  closeDialog: () => void
}

function UnstakeDialogContentContainer({ farm, initialToken, closeDialog }: StakeContainerProps) {
  const {
    selectableAssets,
    assetsFields,
    form,
    outcomeToken,
    canClaim,
    objectives,
    pageStatus,
    txOverview,
    exitFarmSwitchInfo,
    actionsContext,
  } = useUnstakeDialog({
    farm,
    initialToken,
  })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        outcome={outcomeToken}
        reward={exitFarmSwitchInfo.reward}
        closeDialog={closeDialog}
        isExiting={exitFarmSwitchInfo.checked}
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
      canClaim={canClaim}
      farm={farm}
      exitFarmSwitchInfo={exitFarmSwitchInfo}
      actionsContext={actionsContext}
    />
  )
}

const UnstakeDialogContentContainerWithSuspense = withSuspense(UnstakeDialogContentContainer, DialogContentSkeleton)
export { UnstakeDialogContentContainerWithSuspense as UnstakeDialogContentContainer }
