import { Token } from '@/domain/types/Token'
import { withSuspense } from '@/ui/utils/withSuspense'
import { DialogContentSkeleton } from '../../common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '../../common/views/SuccessView'
import { useSavingsDepositDialog } from './logic/useSavingsDepositDialog'
import { SavingsDepositView } from './views/SavingsDepositView'

export interface SavingsDepositContainerProps {
  initialToken: Token
  savingsToken: Token
  closeDialog: () => void
}

function SavingsDepositDialogContentContainer({
  initialToken,
  savingsToken,
  closeDialog,
}: SavingsDepositContainerProps) {
  const {
    selectableAssets,
    assetsFields,
    form,
    tokenToDeposit,
    objectives,
    pageStatus,
    txOverview,
    actionsContext,
    underlyingToken,
  } = useSavingsDepositDialog({
    savingsToken,
    initialToken,
  })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView
        objectiveType="deposit"
        tokenWithValue={tokenToDeposit}
        proceedText="Back to Savings"
        onProceed={closeDialog}
      />
    )
  }

  return (
    <SavingsDepositView
      underlyingToken={underlyingToken}
      form={form}
      selectableAssets={selectableAssets}
      assetsFields={assetsFields}
      objectives={objectives}
      pageStatus={pageStatus}
      txOverview={txOverview}
      actionsContext={actionsContext}
    />
  )
}

const SavingsDepositDialogContentContainerWithSuspense = withSuspense(
  SavingsDepositDialogContentContainer,
  DialogContentSkeleton,
)
export { SavingsDepositDialogContentContainerWithSuspense as SavingsDepositDialogContentContainer }
