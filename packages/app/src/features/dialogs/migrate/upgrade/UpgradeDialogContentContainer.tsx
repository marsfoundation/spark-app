import { Token } from '@/domain/types/Token'
import { withSuspense } from '@/ui/utils/withSuspense'
import { DialogContentSkeleton } from '../../common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '../../common/views/SuccessView'
import { useMigrateDialog } from '../common/logic/useMigrateDialog'
import { UpgradeView } from './views/UpgradeView'

interface UpgradeDialogContentContainerProps {
  fromToken: Token
  toToken: Token
  closeDialog: () => void
}

function UpgradeDialogContentContainer({ fromToken, toToken, closeDialog }: UpgradeDialogContentContainerProps) {
  const {
    objectives,
    pageStatus,
    migrationAmount,
    tokensInfo,
    apyImprovement,
    actionsContext,
    form,
    assetsFields,
    selectableAssets,
  } = useMigrateDialog({
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
    />
  )
}

const UpgradeDialogContentContainerWithSuspense = withSuspense(UpgradeDialogContentContainer, DialogContentSkeleton)
export { UpgradeDialogContentContainerWithSuspense as UpgradeDialogContentContainer }
