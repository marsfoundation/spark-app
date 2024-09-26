import { TokenWithBalance } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { Alert } from '@/features/dialogs/common/components/alert/Alert'
import { DialogForm } from '@/features/dialogs/common/components/form/DialogForm'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TransactionOverview } from '../components/transaction-overview/TransactionOverview'
import { TxOverview } from '../logic/createTxOverview'

export interface StakeViewProps {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  sacrificesYield: boolean
  form: UseFormReturn<AssetInputSchema>
  farm: Farm
  objectives: Objective[]
  pageStatus: PageStatus
  txOverview: TxOverview
  actionsContext: InjectedActionsContext
}

export function StakeView({
  selectableAssets,
  assetsFields,
  sacrificesYield,
  form,
  farm,
  objectives,
  pageStatus,
  txOverview,
  actionsContext,
}: StakeViewProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <MultiPanelDialog panelRef={ref}>
      <DialogTitle>Deposit into {farm.rewardToken.symbol} Farm</DialogTitle>

      <FormAndOverviewWrapper>
        <DialogForm form={form} assetsFields={assetsFields} selectorAssets={selectableAssets} />
        <TransactionOverview txOverview={txOverview} selectedToken={assetsFields.selectedAsset.token} />
      </FormAndOverviewWrapper>

      {sacrificesYield && (
        <Alert variant="danger">
          <p className="max-w-[60ch]">
            Depositing your savings token means that you will no longer earn yield directly from it. Instead, you will
            receive yield from the specific farm you deposit it into.
          </p>
        </Alert>
      )}

      <DialogActionsPanel
        objectives={objectives}
        context={actionsContext}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
