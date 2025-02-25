import { PageLayout } from '@/ui/layouts/PageLayout'
import { ActiveRewardsPanel } from '../components/active-rewards-panel/ActiveRewardsPanel'
import { ClaimAllPanel } from '../components/claim-all-panel/ClaimAllPanel'
import { OngoingCampaignsPanel } from '../components/ongoing-campaigns-panel/OngoingCampaignsPanel'
import { ActiveRewardsResult } from '../logic/useActiveRewards'
import { UseOngoingCampaignsResult } from '../logic/useOngoingCampaigns'
export interface RewardsViewProps {
  ongoingCampaignsResult: UseOngoingCampaignsResult
  activeRewardsResult: ActiveRewardsResult
}

export function RewardsView({ ongoingCampaignsResult, activeRewardsResult }: RewardsViewProps) {
  return (
    <PageLayout>
      <h1 className="typography-heading-1">Rewards</h1>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[11fr_5fr]">
        <ActiveRewardsPanel activeRewardsResult={activeRewardsResult} openClaimDialog={() => {}} />
        <ClaimAllPanel activeRewardsResult={activeRewardsResult} onClaimAll={() => {}} className="self-start" />
        <OngoingCampaignsPanel ongoingCampaignsResult={ongoingCampaignsResult} isGuestMode={false} />
      </div>
    </PageLayout>
  )
}
