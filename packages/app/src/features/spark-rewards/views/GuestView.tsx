import { PageLayout } from '@/ui/layouts/PageLayout'
import { EarnRewardsBanner } from '../components/earn-rewards-banner/EarnRewardsBanner'
import { OngoingCampaignsPanel } from '../components/ongoing-campaigns-panel/OngoingCampaignsPanel'
import { UseOngoingCampaignsResult } from '../logic/useOngoingCampaigns'

export interface GuestViewProps {
  ongoingCampaignsResult: UseOngoingCampaignsResult
}

export function GuestView({ ongoingCampaignsResult }: GuestViewProps) {
  return (
    <PageLayout>
      <h1 className="typography-heading-1">Rewards</h1>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[11fr_5fr]">
        <OngoingCampaignsPanel
          ongoingCampaignsResult={ongoingCampaignsResult}
          isGuestMode={true}
          className="self-start"
        />
        <EarnRewardsBanner className="self-start" />
      </div>
    </PageLayout>
  )
}
