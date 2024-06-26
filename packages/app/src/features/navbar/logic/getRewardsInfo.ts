import { MarketInfo } from '@/domain/market-info/marketInfo'
import { UseQueryResult } from '@tanstack/react-query'
import { RewardsInfo } from '../types'

export function getRewardsInfo(marketInfo: UseQueryResult<MarketInfo>): RewardsInfo {
  return {
    rewards: (marketInfo.data?.userRewards ?? []).map((reward) => ({
      token: reward.token,
      amount: reward.value,
    })),
  }
}
