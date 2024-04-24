import { UseFormReturn } from 'react-hook-form'

import { TokenWithBalance } from '@/domain/common/types'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { DialogForm } from '@/features/dialogs/common/components/form/DialogForm'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'

import { DepositOverviewPanel } from '../../common/components/DepositOverviewPanel'
import { SavingsDialogTxOverview } from '../logic/useTransactionOverview'

export interface SavingsWithdrawViewProps {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview | undefined
}

export function SavingsWithdrawView({
  selectableAssets,
  assetsFields,
  form,
  objectives,
  pageStatus,
  txOverview,
}: SavingsWithdrawViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>Withdraw from Savings</DialogTitle>

      <FormAndOverviewWrapper>
        <DialogForm
          form={form}
          assetsFields={assetsFields}
          selectorAssets={selectableAssets}
          variant="usd"
          walletIconLabel="Savings"
        />
        {txOverview && (
          <DepositOverviewPanel
            txOverview={txOverview}
            showExchangeRate={txOverview.exchangeRatioToToken.symbol !== 'DAI'}
          />
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
