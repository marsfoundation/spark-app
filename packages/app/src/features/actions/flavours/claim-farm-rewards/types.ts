import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenWithoutPrice } from '@/domain/types/Token'

export interface ClaimFarmRewardsObjective {
  type: 'claimFarmRewards'
  farm: CheckedAddress
  rewardToken: TokenWithoutPrice
  rewardAmount: NormalizedUnitNumber
}

export interface ClaimFarmRewardsAction {
  type: 'claimFarmRewards'
  farm: CheckedAddress
  rewardToken: TokenWithoutPrice
  rewardTokenPrice?: NormalizedUnitNumber
  rewardAmount: NormalizedUnitNumber
}
