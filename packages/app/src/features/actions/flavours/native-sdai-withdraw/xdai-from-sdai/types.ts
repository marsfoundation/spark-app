import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export type XDaiFromSDaiWithdrawObjective =
  | {
      type: 'xDaiFromSDaiWithdraw'
      xDai: Token
      value: NormalizedUnitNumber
      sDai: Token
      sDaiValueEstimate: NormalizedUnitNumber
      method: 'withdraw'
    }
  | {
      type: 'xDaiFromSDaiWithdraw'
      xDai: Token
      value: NormalizedUnitNumber
      sDai: Token
      method: 'redeem-all'
    }

export interface XDaiFromSDaiWithdrawAction {
  type: 'xDaiFromSDaiWithdraw'
  xDai: Token
  value: NormalizedUnitNumber
  sDai: Token
  method: 'withdraw' | 'redeem-all'
}
