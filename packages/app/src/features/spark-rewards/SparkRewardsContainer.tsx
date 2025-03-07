import { useAccount } from 'wagmi'
import { useSparkRewards } from './logic/useSparkRewards'
import { AccountConnectingView } from './views/AccountConnectingView'
import { GuestView } from './views/GuestView'
import { RewardsView } from './views/RewardsView'

export function SparkRewardsContainer() {
  const rewards = useSparkRewards()
  const { isConnected, isConnecting } = useAccount()

  if (isConnecting) {
    return <AccountConnectingView />
  }

  if (isConnected === false) {
    return <GuestView ongoingCampaignsResult={rewards.ongoingCampaignsResult} />
  }

  return <RewardsView {...rewards} />
}
