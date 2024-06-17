import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export type NativeSDaiWithdrawObjective =
  | {
      type: 'nativeSDaiWithdraw'
      token: Token
      value: NormalizedUnitNumber
      sDai: Token
      method: 'withdraw'
      sDaiValueEstimate: NormalizedUnitNumber
    }
  | {
      type: 'nativeSDaiWithdraw'
      token: Token
      value: NormalizedUnitNumber
      sDai: Token
      method: 'redeem'
    }

export interface NativeSDaiWithdrawAction {
  type: 'nativeSDaiWithdraw'
  token: Token
  value: NormalizedUnitNumber
  sDai: Token
  method: 'withdraw' | 'redeem'
}
