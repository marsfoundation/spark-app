import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface UnstakeObjective {
  type: 'unstake'
  token: Token // stablecoins
  amount: NormalizedUnitNumber
  farm: CheckedAddress
}

export interface UnstakeAction {
  type: 'unstake'
  stakingToken: Token
  rewardToken: Token
  amount: NormalizedUnitNumber
  farm: CheckedAddress
}
