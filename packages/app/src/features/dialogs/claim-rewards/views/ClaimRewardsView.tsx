import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { Reward } from '@/features/topbar/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { PageStatus } from '../../common/types'
import { ClaimRewardsOverviewPanel } from '../components/ClaimRewardsOverviewPanel'

export interface ClaimRewardsViewProps {
  rewards: Reward[]
  pageStatus: PageStatus
  objectives: Objective[]
}

export function ClaimRewardsView({ rewards, pageStatus, objectives }: ClaimRewardsViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>Claim rewards</DialogTitle>

      <ClaimRewardsOverviewPanel rewards={rewards} />

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
