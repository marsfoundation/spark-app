import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { RiskAcknowledgementInfo } from '@/domain/risk-warning/types'
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
import { WithdrawOverviewPanel } from '../components/WithdrawOverviewPanel'
import { PositionOverview } from '../logic/types'

export interface WithdrawViewProps {
  withdrawOptions: TokenWithBalance[]
  withdrawAsset: TokenWithValue
  assetsToWithdrawFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  pageStatus: PageStatus
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
  riskAcknowledgement: RiskAcknowledgementInfo
}

export function WithdrawView({
  withdrawOptions,
  assetsToWithdrawFields,
  form,
  objectives,
  pageStatus,
  withdrawAsset,
  currentPositionOverview,
  updatedPositionOverview,
  riskAcknowledgement,
}: WithdrawViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>{`Withdraw ${withdrawAsset.token.symbol}`}</DialogTitle>

      <FormAndOverviewWrapper>
        <DialogForm form={form} assetsFields={assetsToWithdrawFields} selectorAssets={withdrawOptions} />
        <WithdrawOverviewPanel
          withdrawAsset={withdrawAsset}
          currentPositionOverview={currentPositionOverview}
          updatedPositionOverview={updatedPositionOverview}
        />
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
