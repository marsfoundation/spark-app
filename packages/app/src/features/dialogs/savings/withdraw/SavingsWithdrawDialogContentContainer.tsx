import { withSuspense } from '@/ui/utils/withSuspense'

import { DialogContentSkeleton } from '../../common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '../../common/views/SuccessView'
import { useSavingsWithdrawDialog } from './logic/useSavingsWithdrawDialog'
import { SavingsWithdrawView } from './views/SavingsWithdrawView'

export interface SavingsWithdrawContainerProps {
  closeDialog: () => void
}

function SavingsWithdrawDialogContentContainer({ closeDialog }: SavingsWithdrawContainerProps) {
  const {
    selectableAssets,
    assetsFields,
    form,
    tokenToWithdraw,
    objectives,
    pageStatus,
    txOverview,
    riskAcknowledgement,
    showMaxPlaceholderInInput,
  } = useSavingsWithdrawDialog()

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
      showMaxPlaceholderInInput={showMaxPlaceholderInInput}
    />
  )
}

const SavingsWithdrawDialogContentContainerWithSuspense = withSuspense(
  SavingsWithdrawDialogContentContainer,
  DialogContentSkeleton,
)
export { SavingsWithdrawDialogContentContainerWithSuspense as SavingsWithdrawDialogContentContainer }
