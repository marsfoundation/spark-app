import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export type DaiFromSDaiWithdrawObjective = {
  type: 'daiFromSDaiWithdraw'
  dai: Token
  value: NormalizedUnitNumber
  sDai: Token
  receiver?: CheckedAddress
  method: 'withdraw' | 'redeem'
}

export interface DaiFromSDaiWithdrawAction {
  type: 'daiFromSDaiWithdraw'
  dai: Token
  value: NormalizedUnitNumber
  sDai: Token
  receiver?: CheckedAddress
  method: 'withdraw' | 'redeem'
}
