import { PageLayout } from '@/ui/layouts/PageLayout'
import { ClaimAllPanel } from '../components/claim-all-panel/ClaimAllPanel'
import { ClaimableRewardsPanel } from '../components/claimable-rewards-panel/ClaimableRewardsPanel'
import { OngoingCampaignsPanel } from '../components/ongoing-campaigns-panel/OngoingCampaignsPanel'
import { ClaimableRewardsResult } from '../logic/useClaimableRewards'
import { UseOngoingCampaignsResult } from '../logic/useOngoingCampaigns'

export interface RewardsViewProps {
  ongoingCampaignsResult: UseOngoingCampaignsResult
  claimableRewardsResult: ClaimableRewardsResult
}

export function RewardsView({ ongoingCampaignsResult, claimableRewardsResult }: RewardsViewProps) {
  return (
    <PageLayout>
      <h1 className="typography-heading-1">Rewards</h1>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[11fr_5fr]">
        <ClaimableRewardsPanel claimableRewardsResult={claimableRewardsResult} />
        <ClaimAllPanel claimableRewardsResult={claimableRewardsResult} onClaimAll={() => {}} className="self-start" />
        <OngoingCampaignsPanel ongoingCampaignsResult={ongoingCampaignsResult} isGuestMode={false} />
      </div>
    </PageLayout>
  )
}
