import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { ClaimTransactionOverview } from '../components/transaction-overview/ClaimTransactionOverview'
import { TxOverview } from '../types'

export interface ClaimViewProps {
  objectives: Objective[]
  pageStatus: PageStatus
  txOverview: TxOverview
  actionsContext: InjectedActionsContext
}

export function ClaimView({ objectives, pageStatus, txOverview, actionsContext }: ClaimViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>Claim rewards</DialogTitle>

      <FormAndOverviewWrapper>
        <ClaimTransactionOverview txOverview={txOverview} />
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
