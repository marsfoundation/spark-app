import { UseFormReturn } from 'react-hook-form'

import { TokenWithBalance } from '@/domain/common/types'
import { Token } from '@/domain/types/Token'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { DialogForm } from '@/features/dialogs/common/components/form/DialogForm'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'

import { RepayOverviewPanel } from '../components/RepayOverviewPanel'
import { PositionOverview } from '../logic/types'

export interface RepayViewProps {
  debtAsset: Token
  repayOptions: TokenWithBalance[]
  assetsToRepayFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  pageStatus: PageStatus
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}

export function RepayView({
  debtAsset,
  repayOptions,
  assetsToRepayFields,
  form,
  objectives,
  pageStatus,
  currentPositionOverview,
  updatedPositionOverview,
}: RepayViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>{`Repay ${debtAsset.symbol}`}</DialogTitle>

      <FormAndOverviewWrapper>
        <DialogForm form={form} assetsFields={assetsToRepayFields} selectorAssets={repayOptions} />
        <RepayOverviewPanel
          debtAsset={debtAsset}
          currentPositionOverview={currentPositionOverview}
          updatedPositionOverview={updatedPositionOverview}
        />
      </FormAndOverviewWrapper>

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
