import { Token } from '@/domain/types/Token'
import { DialogContentSkeleton } from '@/features/dialogs/common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '@/features/dialogs/common/views/SuccessView'
import { withSuspense } from '@/ui/utils/withSuspense'
import { useMigrateDialog } from '../common/logic/useMigrateDialog'
import { UpgradeView } from './views/UpgradeView'

interface UpgradeDialogContentContainerProps {
  fromToken: Token
  toToken: Token
  closeDialog: () => void
}

function UpgradeDialogContentContainer({ fromToken, toToken, closeDialog }: UpgradeDialogContentContainerProps) {
  const { objectives, pageStatus, migrationAmount, actionsContext, form, assetsFields, selectableAssets, dai, sdai } =
    useMigrateDialog({
      type: 'upgrade',
      fromToken,
      toToken,
    })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        tokenWithValue={{ token: fromToken, value: migrationAmount }}
        proceedText="Back to Savings"
        objectiveType="upgrade"
        onProceed={closeDialog}
        className="p-6"
      />
    )
  }

  return (
    <UpgradeView
      fromToken={fromToken}
      toToken={toToken}
      pageStatus={pageStatus}
      objectives={objectives}
      actionsContext={actionsContext}
      form={form}
      assetsFields={assetsFields}
      selectableAssets={selectableAssets}
      dai={dai}
      sdai={sdai}
    />
  )
}

const UpgradeDialogContentContainerWithSuspense = withSuspense(UpgradeDialogContentContainer, DialogContentSkeleton)
export { UpgradeDialogContentContainerWithSuspense as UpgradeDialogContentContainer }
