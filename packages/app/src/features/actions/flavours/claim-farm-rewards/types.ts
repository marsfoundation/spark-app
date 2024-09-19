import { CheckedAddress } from '@/domain/types/CheckedAddress'
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
