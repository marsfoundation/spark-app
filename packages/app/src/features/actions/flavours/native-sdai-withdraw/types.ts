import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface NativeSDaiWithdrawObjective {
  type: 'nativeSDaiWithdraw'
  token: Token
  value: NormalizedUnitNumber
  sDai: Token
  method: 'withdraw' | 'redeem'
}

export interface NativeSDaiWithdrawAction {
  type: 'nativeSDaiWithdraw'
  token: Token
  value: NormalizedUnitNumber
  sDai: Token
  method: 'withdraw' | 'redeem'
}
