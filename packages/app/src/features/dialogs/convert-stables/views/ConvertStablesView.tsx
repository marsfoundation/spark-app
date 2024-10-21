import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { UseFormReturn } from 'react-hook-form'
import { ConvertStablesForm } from '../components/form/ConvertStablesForm'
import { TransactionOverview } from '../components/transaction-overview/TransactionOverview'
import { TxOverview } from '../logic/createTxOverview'
import { ConvertStablesFormSchema } from '../logic/form/schema'
import { ConvertStablesFormFields } from '../types'

export interface ConvertStablesViewProps {
  formFields: ConvertStablesFormFields
  form: UseFormReturn<ConvertStablesFormSchema>
  objectives: Objective[]
  pageStatus: PageStatus
  txOverview: TxOverview
  actionsContext: InjectedActionsContext
}

export function ConvertStablesView({
  formFields,
  form,
  objectives,
  pageStatus,
  txOverview,
  actionsContext,
}: ConvertStablesViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>Convert Tokens</DialogTitle>

      <FormAndOverviewWrapper>
        <ConvertStablesForm form={form} formFields={formFields} />
        <TransactionOverview
          txOverview={txOverview}
          inToken={formFields.selectedAssetIn.token}
          outToken={formFields.selectedAssetOut.token}
        />
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
