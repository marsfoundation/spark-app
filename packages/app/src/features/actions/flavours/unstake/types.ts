import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token, TokenWithoutPrice } from '@/domain/types/Token'

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
  rewardToken: TokenWithoutPrice
  amount: NormalizedUnitNumber
  exit: boolean
  farm: CheckedAddress
}
