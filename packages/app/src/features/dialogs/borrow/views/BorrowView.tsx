import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { RiskAcknowledgementInfo } from '@/domain/liquidation-risk-warning/types'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { DialogForm } from '@/features/dialogs/common/components/form/DialogForm'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { RiskAcknowledgement } from '@/ui/organisms/risk-acknowledgement/RiskAcknowledgement'
import BigNumber from 'bignumber.js'
import { UseFormReturn } from 'react-hook-form'
import { BorrowOverviewPanel } from '../components/BorrowOverviewPanel'

export interface BorrowViewProps {
  selectableAssets: TokenWithBalance[]
  borrowAsset: TokenWithValue
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  actionsContext: InjectedActionsContext
  pageStatus: PageStatus
  currentHealthFactor?: BigNumber
  updatedHealthFactor?: BigNumber
  riskAcknowledgement: RiskAcknowledgementInfo
}

export function BorrowView({
  selectableAssets,
  assetsFields,
  form,
  objectives,
  actionsContext,
  pageStatus,
  borrowAsset,
  currentHealthFactor,
  updatedHealthFactor,
  riskAcknowledgement,
}: BorrowViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>{`Borrow ${borrowAsset.token.symbol}`}</DialogTitle>

      <FormAndOverviewWrapper>
        <DialogForm form={form} assetsFields={assetsFields} selectorAssets={selectableAssets} />
        <BorrowOverviewPanel currentHealthFactor={currentHealthFactor} updatedHealthFactor={updatedHealthFactor} />
      </FormAndOverviewWrapper>

      {riskAcknowledgement.warning && (
        <RiskAcknowledgement
          onStatusChange={riskAcknowledgement.onStatusChange}
          warning={riskAcknowledgement.warning}
        />
      )}

      <DialogActionsPanel
        context={actionsContext}
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
