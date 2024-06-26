import { MarketInfo } from '@/domain/market-info/marketInfo'
import { Reward } from '@/features/navbar/components/rewards-badge/types'

export function getRewardsToClaim(marketInfo: MarketInfo): Reward[] {
  return marketInfo.userRewards.map((reward) => ({
    token: reward.token,
    amount: reward.value,
  }))
}
