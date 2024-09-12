import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface StakeObjective {
  type: 'stake'
  inputToken: Token
  stakeAmount: NormalizedUnitNumber
  farm: CheckedAddress
  isMax: boolean
}

export interface StakeAction {
  type: 'stake'
  stakingToken: Token
  stakeAmount: NormalizedUnitNumber
  rewardToken: Token
  farm: CheckedAddress
}
