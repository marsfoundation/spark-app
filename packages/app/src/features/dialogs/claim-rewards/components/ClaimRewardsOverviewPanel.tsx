import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'

import { Reward } from '@/features/navbar/components/rewards-badge/types'
import { RewardsList } from './RewardsList'

export interface ClaimRewardsOverviewPanelProps {
  rewards: Reward[]
}
export function ClaimRewardsOverviewPanel({ rewards }: ClaimRewardsOverviewPanelProps) {
  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>
      <RewardsList rewards={rewards} className="mt-2" />
    </DialogPanel>
  )
}
