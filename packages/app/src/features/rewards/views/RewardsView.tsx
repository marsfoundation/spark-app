import { PageLayout } from '@/ui/layouts/PageLayout'
import { GuestModePanel } from '../components/guest-mode-panel/GuestModePanel'
import { OngoingCampaignsPanel } from '../components/ongoing-campaigns-panel/OngoingCampaignsPanel'
import { UseOngoingCampaignsResult } from '../logic/useOngoingCampaigns'

export interface RewardsViewProps {
  ongoingCampaignsResult: UseOngoingCampaignsResult
  isGuestMode: boolean
}

export function RewardsView({ ongoingCampaignsResult, isGuestMode }: RewardsViewProps) {
  return (
    <PageLayout>
      <h1 className="typography-heading-1">Rewards</h1>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[11fr_5fr]">
        <OngoingCampaignsPanel ongoingCampaignsResult={ongoingCampaignsResult} isGuestMode={isGuestMode} />
        {isGuestMode && <GuestModePanel />}
      </div>
    </PageLayout>
  )
}
