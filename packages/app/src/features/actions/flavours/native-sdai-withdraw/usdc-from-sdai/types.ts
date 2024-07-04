import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Mode } from '@/features/dialogs/savings/withdraw/types'

export type USDCFromSDaiWithdrawObjective = {
  type: 'usdcFromSDaiWithdraw'
  usdc: Token
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

export interface USDCFromSDaiWithdrawAction {
  type: 'usdcFromSDaiWithdraw'
  usdc: Token
  value: NormalizedUnitNumber
  sDai: Token
  receiver?: CheckedAddress
  mode: Mode
  reserveAddresses?: CheckedAddress[]
  method: 'withdraw' | 'redeem'
}
