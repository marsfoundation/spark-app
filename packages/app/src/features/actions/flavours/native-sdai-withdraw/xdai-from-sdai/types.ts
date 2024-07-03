import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export type XDaiFromSDaiWithdrawObjective =
  | {
      type: 'xDaiFromSDaiWithdraw'
      xDai: Token
      value: NormalizedUnitNumber
      sDai: Token
      sDaiValueEstimate: NormalizedUnitNumber
      receiver?: CheckedAddress
      method: 'withdraw'
    }
  | {
      type: 'xDaiFromSDaiWithdraw'
      xDai: Token
      value: NormalizedUnitNumber
      sDai: Token
      receiver?: CheckedAddress
      method: 'redeem'
    }

export interface XDaiFromSDaiWithdrawAction {
  type: 'xDaiFromSDaiWithdraw'
  xDai: Token
  value: NormalizedUnitNumber
  sDai: Token
  receiver?: CheckedAddress
  method: 'withdraw' | 'redeem'
}
