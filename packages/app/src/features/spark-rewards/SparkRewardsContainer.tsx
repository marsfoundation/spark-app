import { useAccount } from 'wagmi'
import { useSparkRewards } from './logic/useSparkRewards'
import { AccountConnectingView } from './views/AccountConnectingView'
import { GuestView } from './views/GuestView'
import { RewardsView } from './views/RewardsView'

export function SparkRewardsContainer() {
  const rewards = useSparkRewards()
  const { address: account, isConnecting } = useAccount()

  if (isConnecting && account === undefined) {
    return <AccountConnectingView />
  }

  if (account === undefined) {
    return <GuestView ongoingCampaignsResult={rewards.ongoingCampaignsResult} />
  }

  return <RewardsView {...rewards} />
}
