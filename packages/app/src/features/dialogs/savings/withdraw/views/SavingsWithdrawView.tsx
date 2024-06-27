import { RiskAcknowledgementInfo } from '@/domain/common/risk'
import { TokenWithBalance } from '@/domain/common/types'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { DialogForm } from '@/features/dialogs/common/components/form/DialogForm'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { RiskAcknowledgement } from '@/ui/organisms/risk-acknowledgement/RiskAcknowledgement'
import { UseFormReturn } from 'react-hook-form'
import { LiFiTransactionOverview } from '../../common/components/LiFiTransactionOverview'
import { MakerTransactionOverview } from '../../common/components/maker-transaction-overview'
import { SavingsDialogTxOverview } from '../../common/types'

export interface SavingsWithdrawViewProps {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview
  riskAcknowledgement: RiskAcknowledgementInfo
}

export function SavingsWithdrawView({
  selectableAssets,
  assetsFields,
  form,
  objectives,
  pageStatus,
  txOverview,
  riskAcknowledgement,
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
        {txOverview.type === 'lifi' && <LiFiTransactionOverview txOverview={txOverview} />}
        {txOverview.type === 'maker' && (
          <MakerTransactionOverview txOverview={txOverview} selectedToken={assetsFields.selectedAsset.token} />
        )}
      </FormAndOverviewWrapper>
      {riskAcknowledgement.warning && (
        <RiskAcknowledgement
          onStatusChange={riskAcknowledgement.onStatusChange}
          warning={riskAcknowledgement.warning}
        />
      )}

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
