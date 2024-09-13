import { Token } from '@/domain/types/Token'
import { DialogContentSkeleton } from '@/features/dialogs/common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '@/features/dialogs/common/views/SuccessView'
import { withSuspense } from '@/ui/utils/withSuspense'
import { useMigrateDialog } from '../common/logic/useMigrateDialog'
import { DowngradeUSDSToDaiView } from './views/DowngradeUSDSToDaiView'

interface DowngradeDialogContentContainerProps {
  fromToken: Token
  toToken: Token
  closeDialog: () => void
}

function DowngradeDialogContentContainer({ fromToken, toToken, closeDialog }: DowngradeDialogContentContainerProps) {
  const { objectives, pageStatus, migrationAmount, form, assetsFields, selectableAssets, txOverview } =
    useMigrateDialog({
      type: 'downgrade',
      fromToken,
      toToken,
    })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        tokenWithValue={{ token: fromToken, value: migrationAmount }}
        proceedText="Back to Savings"
        objectiveType="downgrade"
        onProceed={closeDialog}
      />
    )
  }

  return (
    <DowngradeUSDSToDaiView
      fromToken={fromToken}
      toToken={toToken}
      pageStatus={pageStatus}
      objectives={objectives}
      form={form}
      assetsFields={assetsFields}
      selectableAssets={selectableAssets}
      txOverview={txOverview}
    />
  )
}

const DowngradeDialogContentContainerWithSuspense = withSuspense(DowngradeDialogContentContainer, DialogContentSkeleton)
export { DowngradeDialogContentContainerWithSuspense as DowngradeDialogContentContainer }
