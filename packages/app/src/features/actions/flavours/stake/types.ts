import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface StakeObjective {
  type: 'stake'
  token: Token // any supported input token
  amount: NormalizedUnitNumber // amount of input token, not necessarily stake amount (e.g. when input is sdai/susds)
  farm: CheckedAddress
  isMax: boolean
}

export interface StakeAction {
  type: 'stake'
  stakingToken: Token // usds or other supported staking token
  stakeAmount: NormalizedUnitNumber // amount of staking token (usds or other supported staking token)
  rewardToken: Token
  farm: CheckedAddress
}
