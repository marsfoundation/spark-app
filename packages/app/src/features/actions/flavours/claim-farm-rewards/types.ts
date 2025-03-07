import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { CheckedAddress } from '@marsfoundation/common-universal'

export interface ClaimFarmRewardsObjective {
  type: 'claimFarmRewards'
  farm: CheckedAddress
  rewardToken: Token
  rewardAmount: NormalizedUnitNumber
}

export interface ClaimFarmRewardsAction {
  type: 'claimFarmRewards'
  farm: CheckedAddress
  rewardToken: Token
  rewardAmount: NormalizedUnitNumber
}
