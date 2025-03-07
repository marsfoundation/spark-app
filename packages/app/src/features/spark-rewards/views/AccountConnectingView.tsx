import { PageLayout } from '@/ui/layouts/PageLayout'
import { PendingPanel as ClaimAllPendingPanel } from '../components/claim-all-panel/ClaimAllPanel'
import { PendingPanel as ClaimableRewardsPendingPanel } from '../components/claimable-rewards-panel/ClaimableRewardsPanel'
import { PendingPanel as OngoingCampaignsPendingPanel } from '../components/ongoing-campaigns-panel/OngoingCampaignsPanel'

export function AccountConnectingView() {
  return (
    <PageLayout>
      <h1 className="typography-heading-1">Rewards</h1>
      <div className="grid grid-cols-1 gap-5 lg:grid-flow-col lg:grid-cols-[11fr_5fr] lg:grid-rows-[auto_auto]">
        <ClaimableRewardsPendingPanel />
        <OngoingCampaignsPendingPanel />
        <ClaimAllPendingPanel className="row-start-2 lg:row-span-full lg:self-start" />
      </div>
    </PageLayout>
  )
}
