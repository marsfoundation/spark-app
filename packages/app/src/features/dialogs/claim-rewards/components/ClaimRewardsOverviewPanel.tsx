import { Reward } from '@/features/topbar/types'
import { TransactionOverview } from '@/ui/organisms/new/transaction-overview/TransactionOverview'
import { RewardsList } from './RewardsList'

export interface ClaimRewardsOverviewPanelProps {
  rewards: Reward[]
}
export function ClaimRewardsOverviewPanel({ rewards }: ClaimRewardsOverviewPanelProps) {
  return (
    <TransactionOverview>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Rewards</TransactionOverview.Label>
        <TransactionOverview.Generic>
          <RewardsList rewards={rewards} />
        </TransactionOverview.Generic>
      </TransactionOverview.Row>
    </TransactionOverview>
  )
}
