import { TokenWithBalance } from '@/domain/common/types'
import { Token } from '@/domain/types/Token'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { DialogForm } from '@/features/dialogs/common/components/form/DialogForm'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { UseFormReturn } from 'react-hook-form'
import { TransactionOverview } from '../../common/components/transaction-overview'
import { SavingsDialogTxOverview } from '../../common/types'

export interface SavingsDepositViewProps {
  savingsToken: Token
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview
  actionsContext: InjectedActionsContext
}

export function SavingsDepositView({
  savingsToken,
  selectableAssets,
  assetsFields,
  form,
  objectives,
  pageStatus,
  txOverview,
  actionsContext,
}: SavingsDepositViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>Deposit to {savingsToken.name}</DialogTitle>

      <FormAndOverviewWrapper>
        <DialogForm form={form} assetsFields={assetsFields} selectorAssets={selectableAssets} />
        <TransactionOverview txOverview={txOverview} selectedToken={assetsFields.selectedAsset.token} showAPY />
      </FormAndOverviewWrapper>

      <DialogActionsPanel
        objectives={objectives}
        context={actionsContext}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
