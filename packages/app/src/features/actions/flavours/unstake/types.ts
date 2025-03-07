import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { CheckedAddress } from '@marsfoundation/common-universal'

export interface UnstakeObjective {
  type: 'unstake'
  token: Token // stablecoins
  amount: NormalizedUnitNumber
  exit: boolean
  farm: CheckedAddress
}

export interface UnstakeAction {
  type: 'unstake'
  stakingToken: Token
  rewardToken: Token
  amount: NormalizedUnitNumber
  exit: boolean
  farm: CheckedAddress
}
