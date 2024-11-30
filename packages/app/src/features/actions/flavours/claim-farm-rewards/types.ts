import { CheckedAddress } from '@marsfoundation/common-universal'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

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
