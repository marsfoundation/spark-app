import { PageLayout } from '@/ui/layouts/PageLayout'
import { ClaimAllPanel } from '../components/claim-all-panel/ClaimAllPanel'
import { ClaimableRewardsPanel } from '../components/claimable-rewards-panel/ClaimableRewardsPanel'
import { OngoingCampaignsPanel } from '../components/ongoing-campaigns-panel/OngoingCampaignsPanel'
import { UseClaimableRewardsResult } from '../logic/useClaimableRewards'
import { UseClaimableRewardsSummaryResult } from '../logic/useClaimableRewardsSummary'
import { UseOngoingCampaignsResult } from '../logic/useOngoingCampaigns'
export interface RewardsViewProps {
  ongoingCampaignsResult: UseOngoingCampaignsResult
  claimableRewardsResult: UseClaimableRewardsResult
  claimableRewardsSummaryResult: UseClaimableRewardsSummaryResult
  selectNetwork: () => void
}

export function RewardsView({
  ongoingCampaignsResult,
  claimableRewardsResult,
  claimableRewardsSummaryResult,
  selectNetwork,
}: RewardsViewProps) {
  return (
    <PageLayout>
      <h1 className="typography-heading-1">Rewards</h1>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[11fr_5fr]">
        <div className="flex flex-col gap-5">
          <ClaimableRewardsPanel claimableRewardsResult={claimableRewardsResult} />
          <OngoingCampaignsPanel ongoingCampaignsResult={ongoingCampaignsResult} isGuestMode={false} />
        </div>
        <ClaimAllPanel
          claimableRewardsSummaryResult={claimableRewardsSummaryResult}
          selectNetwork={selectNetwork}
          className="self-start"
        />
      </div>
    </PageLayout>
  )
}
