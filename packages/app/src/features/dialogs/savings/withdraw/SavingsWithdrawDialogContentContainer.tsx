import { withSuspense } from '@/ui/utils/withSuspense'
import { DialogContentSkeleton } from '../../common/components/skeletons/DialogContentSkeleton'
import { useSavingsWithdrawDialog } from './logic/useSavingsWithdrawDialog'
import { Mode } from './types'
import { SavingsWithdrawView } from './views/SavingsWithdrawView'
import { SuccessView } from './views/SuccessView'

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
    showMaxPlaceholderInInput,
    sendModeExtension,
  } = useSavingsWithdrawDialog(mode)

  if (pageStatus.state === 'success') {
    return (
      <SuccessView tokenToWithdraw={tokenToWithdraw} closeDialog={closeDialog} sendModeExtension={sendModeExtension} />
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
      sendModeExtension={sendModeExtension}
    />
  )
}

const SavingsWithdrawDialogContentContainerWithSuspense = withSuspense(
  SavingsWithdrawDialogContentContainer,
  DialogContentSkeleton,
)
export { SavingsWithdrawDialogContentContainerWithSuspense as SavingsWithdrawDialogContentContainer }
