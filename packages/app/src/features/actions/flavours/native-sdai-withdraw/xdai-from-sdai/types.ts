import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Mode } from '@/features/dialogs/savings/withdraw/types'

export type XDaiFromSDaiWithdrawObjective =
  | {
      type: 'xDaiFromSDaiWithdraw'
      xDai: Token
      value: NormalizedUnitNumber
      sDai: Token
      sDaiValueEstimate: NormalizedUnitNumber
      receiver?: CheckedAddress
      mode: Mode
      method: 'withdraw'
    }
  | {
      type: 'xDaiFromSDaiWithdraw'
      xDai: Token
      value: NormalizedUnitNumber
      sDai: Token
      receiver?: CheckedAddress
      mode: Mode
      method: 'redeem'
    }

export interface XDaiFromSDaiWithdrawAction {
  type: 'xDaiFromSDaiWithdraw'
  xDai: Token
  value: NormalizedUnitNumber
  sDai: Token
  receiver?: CheckedAddress
  mode: Mode
  method: 'withdraw' | 'redeem'
}
