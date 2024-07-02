import { withSuspense } from '@/ui/utils/withSuspense'
import { DialogContentSkeleton } from '../../common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '../../common/views/SuccessView'
import { useSavingsWithdrawDialog } from './logic/useSavingsWithdrawDialog'
import { Mode } from './types'
import { SavingsWithdrawView } from './views/SavingsWithdrawView'

export interface SavingsWithdrawContainerProps {
  closeDialog: () => void
  mode: Mode
}

function SavingsWithdrawDialogContentContainer({ closeDialog, mode }: SavingsWithdrawContainerProps) {
  const {
    selectableAssets,
    assetsFields,
    form,
    tokenToWithdraw,
    objectives,
    pageStatus,
    txOverview,
    riskAcknowledgement,
    sendModeOptions,
  } = useSavingsWithdrawDialog(mode)

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        objectiveType="withdraw"
        tokenWithValue={tokenToWithdraw}
        proceedText="Back to Savings"
        onProceed={closeDialog}
      />
    )
  }

  return (
    <SavingsWithdrawView
      form={form}
      selectableAssets={selectableAssets}
      assetsFields={assetsFields}
      objectives={objectives}
      pageStatus={pageStatus}
      txOverview={txOverview}
      riskAcknowledgement={riskAcknowledgement}
      sendModeOptions={sendModeOptions}
    />
  )
}

const SavingsWithdrawDialogContentContainerWithSuspense = withSuspense(
  SavingsWithdrawDialogContentContainer,
  DialogContentSkeleton,
)
export { SavingsWithdrawDialogContentContainerWithSuspense as SavingsWithdrawDialogContentContainer }
