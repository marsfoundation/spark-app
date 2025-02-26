import { PageLayout } from '@/ui/layouts/PageLayout'
import { PendingPanel as ActiveRewardsPendingPanel } from '../components/active-rewards-panel/ActiveRewardsPanel'
import { PendingPanel as ClaimAllPendingPanel } from '../components/claim-all-panel/ClaimAllPanel'
import { PendingPanel as OngoingCampaignsPendingPanel } from '../components/ongoing-campaigns-panel/OngoingCampaignsPanel'

export function AccountConnectingView() {
  return (
    <PageLayout>
      <h1 className="typography-heading-1">Rewards</h1>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[11fr_5fr]">
        <ActiveRewardsPendingPanel />
        <ClaimAllPendingPanel />
        <OngoingCampaignsPendingPanel />
      </div>
    </PageLayout>
  )
}
