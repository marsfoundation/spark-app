import { MarketInfo } from '@/domain/market-info/marketInfo'
import { ClaimRewardsObjective } from '@/features/actions/flavours/claim-rewards/types'

export function createClaimRewardsObjectives(marketInfo: MarketInfo): ClaimRewardsObjective[] {
  return marketInfo.userRewards.map((reward) => ({
    assets: reward.assets,
    incentiveControllerAddress: reward.incentiveControllerAddress,
    token: reward.token,
    type: 'claimRewards',
  }))
}
