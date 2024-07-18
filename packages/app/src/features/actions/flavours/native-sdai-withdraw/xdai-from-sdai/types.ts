import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Mode } from '@/features/dialogs/savings/withdraw/types'

export type XDaiFromSDaiWithdrawObjective = {
  type: 'xDaiFromSDaiWithdraw'
  xDai: Token
  value: NormalizedUnitNumber
  sDai: Token
} & (
  | {
      method: 'withdraw'
      sDaiValueEstimate: NormalizedUnitNumber
    }
  | {
      method: 'redeem'
    }
) &
  (
    | {
        mode: 'send'
        receiver?: CheckedAddress
        reserveAddresses: CheckedAddress[]
      }
    | {
        mode: 'withdraw'
      }
  )

export interface XDaiFromSDaiWithdrawAction {
  type: 'xDaiFromSDaiWithdraw'
  xDai: Token
  value: NormalizedUnitNumber
  sDai: Token
  receiver?: CheckedAddress
  reserveAddresses?: CheckedAddress[]
  mode: Mode
  method: 'withdraw' | 'redeem'
}
