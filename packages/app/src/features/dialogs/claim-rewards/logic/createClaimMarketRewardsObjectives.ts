import { MarketInfo } from '@/domain/market-info/marketInfo'
import { ClaimMarketRewardsObjective } from '@/features/actions/flavours/claim-market-rewards/types'

export function createClaimMarketRewardsObjectives(marketInfo: MarketInfo): ClaimMarketRewardsObjective[] {
  return marketInfo.userRewards.map((reward) => ({
    assets: reward.assets,
    incentiveControllerAddress: reward.incentiveControllerAddress,
    token: reward.token,
    type: 'claimMarketRewards',
  }))
}
