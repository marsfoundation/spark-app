import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface StakeObjective {
  type: 'stake'
  token: Token // any supported input token (e.g. dai, usds, usdc, sdai, susds, ...)
  amount: NormalizedUnitNumber // amount of input token, not necessarily stake amount (in case when input is savings token)
  farm: CheckedAddress
  isMax: boolean
}

export interface StakeAction {
  type: 'stake'
  stakingToken: Token // e.g. usds for Sky farms
  stakeAmount: NormalizedUnitNumber
  rewardToken: Token
  farm: CheckedAddress
}
