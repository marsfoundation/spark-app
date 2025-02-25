import { useUnsupportedChain } from '@/domain/hooks/useUnsupportedChain'
import { useRewards } from './logic/useRewards'
import { GuestView } from './views/GuestView'
import { RewardsView } from './views/RewardsView'

export function RewardsContainer() {
  const rewards = useRewards()
  const { isGuestMode } = useUnsupportedChain()

  if (isGuestMode) {
    return <GuestView ongoingCampaignsResult={rewards.ongoingCampaignsResult} />
  }

  return <RewardsView {...rewards} />
}
