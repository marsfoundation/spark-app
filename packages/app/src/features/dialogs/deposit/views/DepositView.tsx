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

import { DepositOverviewPanel } from '../components/DepositOverviewPanel'
import { PositionOverview } from '../logic/types'

export interface DepositViewProps {
  initialToken: Token
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  pageStatus: PageStatus
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}

export function DepositView({
  initialToken,
  selectableAssets,
  assetsFields,
  form,
  objectives,
  pageStatus,
  currentPositionOverview,
  updatedPositionOverview,
}: DepositViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>{`Deposit ${initialToken.symbol}`}</DialogTitle>

      <FormAndOverviewWrapper>
        <DialogForm form={form} assetsFields={assetsFields} selectorAssets={selectableAssets} />
        <DepositOverviewPanel
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
