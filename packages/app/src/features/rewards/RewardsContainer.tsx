import { useUnsupportedChain } from '@/domain/hooks/useUnsupportedChain'
import { useRewards } from './logic/useRewards'
import { RewardsView } from './views/RewardsView'

export function RewardsContainer() {
  const { ongoingCampaignsResult } = useRewards()
  const { isGuestMode } = useUnsupportedChain()

  return <RewardsView ongoingCampaignsResult={ongoingCampaignsResult} isGuestMode={isGuestMode} />
}
