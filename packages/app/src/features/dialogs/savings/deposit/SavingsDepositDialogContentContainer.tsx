import { Token } from '@/domain/types/Token'
import { withSuspense } from '@/ui/utils/withSuspense'

import { DialogContentSkeleton } from '../../common/components/skeletons/DialogContentSkeleton'
import { SuccessView } from '../../common/views/SuccessView'
import { useSavingsDepositDialog } from './logic/useSavingsDepositDialog'
import { SavingsDepositView } from './views/SavingsDepositView'

export interface SavingsDepositContainerProps {
  initialToken: Token
  closeDialog: () => void
}

function SavingsDepositDialogContentContainer({ initialToken, closeDialog }: SavingsDepositContainerProps) {
  const {
    selectableAssets,
    assetsFields,
    form,
    tokenToDeposit,
    objectives,
    pageStatus,
    txOverview,
    savingsNstSwitchInfo,
    actionsContext,
  } = useSavingsDepositDialog({
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
      form={form}
      selectableAssets={selectableAssets}
      assetsFields={assetsFields}
      objectives={objectives}
      pageStatus={pageStatus}
      txOverview={txOverview}
      savingsNstSwitchInfo={savingsNstSwitchInfo}
      actionsContext={actionsContext}
    />
  )
}

const SavingsDepositDialogContentContainerWithSuspense = withSuspense(
  SavingsDepositDialogContentContainer,
  DialogContentSkeleton,
)
export { SavingsDepositDialogContentContainerWithSuspense as SavingsDepositDialogContentContainer }
