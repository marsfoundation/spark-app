import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export type DaiFromSDaiWithdrawObjective = {
  type: 'daiFromSDaiWithdraw'
  dai: Token
  value: NormalizedUnitNumber
  sDai: Token
  method: 'withdraw' | 'redeem'
}

export interface DaiFromSDaiWithdrawAction {
  type: 'daiFromSDaiWithdraw'
  dai: Token
  value: NormalizedUnitNumber
  sDai: Token
  method: 'withdraw' | 'redeem'
}
