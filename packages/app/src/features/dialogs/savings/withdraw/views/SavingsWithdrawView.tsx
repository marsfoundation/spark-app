import { TokenWithBalance } from '@/domain/common/types'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { UseFormReturn } from 'react-hook-form'
import { MakerTransactionOverview } from '../../common/components/maker-transaction-overview'
import { SavingsDialogTxOverview } from '../../common/types'
import { SavingsWithdrawDialogForm } from '../components/form/SavingsWithdrawDialogForm'
import { SendModeExtension } from '../types'

export interface SavingsWithdrawViewProps {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview
  showMaxPlaceholderInInput: boolean
  sendModeExtension?: SendModeExtension
}

export function SavingsWithdrawView({
  selectableAssets,
  assetsFields,
  form,
  objectives,
  pageStatus,
  txOverview,
  showMaxPlaceholderInInput,
  sendModeExtension,
}: SavingsWithdrawViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>{`${sendModeExtension ? 'Send' : 'Withdraw'} from Savings`}</DialogTitle>

      <FormAndOverviewWrapper>
        <SavingsWithdrawDialogForm
          form={form}
          sendModeExtension={sendModeExtension}
          assetsFields={assetsFields}
          selectorAssets={selectableAssets}
          showMaxPlaceholder={showMaxPlaceholderInInput}
          variant="usd"
          walletIconLabel="Savings"
        />
        {/* @todo: remove this, maker is the only tx type */}
        {txOverview.type === 'maker' && (
          <MakerTransactionOverview txOverview={txOverview} selectedToken={assetsFields.selectedAsset.token} />
        )}
      </FormAndOverviewWrapper>

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
