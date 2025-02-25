import { useUnsupportedChain } from '@/domain/hooks/useUnsupportedChain'
import { useSparkRewards } from './logic/useSparkRewards'
import { GuestView } from './views/GuestView'
import { RewardsView } from './views/RewardsView'

export function SparkRewardsContainer() {
  const rewards = useSparkRewards()
  const { isGuestMode } = useUnsupportedChain()

  if (isGuestMode) {
    return <GuestView ongoingCampaignsResult={rewards.ongoingCampaignsResult} />
  }

  return <RewardsView {...rewards} />
}
