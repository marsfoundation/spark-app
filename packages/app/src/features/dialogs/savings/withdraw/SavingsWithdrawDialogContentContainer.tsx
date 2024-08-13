import { withSuspense } from '@/ui/utils/withSuspense'
import { DialogContentSkeleton } from '../../common/components/skeletons/DialogContentSkeleton'
import { useSavingsWithdrawDialog } from './logic/useSavingsWithdrawDialog'
import { Mode, SavingsType } from './types'
import { SavingsWithdrawView } from './views/SavingsWithdrawView'
import { SuccessView } from './views/SuccessView'

export interface SavingsWithdrawContainerProps {
  closeDialog: () => void
  mode: Mode
  savingsType: SavingsType
}

function SavingsWithdrawDialogContentContainer({ closeDialog, mode, savingsType }: SavingsWithdrawContainerProps) {
  const {
    selectableAssets,
    assetsFields,
    form,
    tokenToWithdraw,
    objectives,
    pageStatus,
    txOverview,
    sendModeExtension,
    actionsContext,
  } = useSavingsWithdrawDialog({ mode, savingsType })

  if (pageStatus.state === 'success') {
    return (
      <SuccessView tokenToWithdraw={tokenToWithdraw} closeDialog={closeDialog} sendModeExtension={sendModeExtension} />
    )
  }

  return (
    <SavingsWithdrawView
      savingsType={savingsType}
      form={form}
      selectableAssets={selectableAssets}
      assetsFields={assetsFields}
      objectives={objectives}
      pageStatus={pageStatus}
      txOverview={txOverview}
      actionsContext={actionsContext}
      sendModeExtension={sendModeExtension}
    />
  )
}

const SavingsWithdrawDialogContentContainerWithSuspense = withSuspense(
  SavingsWithdrawDialogContentContainer,
  DialogContentSkeleton,
)
export { SavingsWithdrawDialogContentContainerWithSuspense as SavingsWithdrawDialogContentContainer }
