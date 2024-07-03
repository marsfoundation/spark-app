import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Mode } from '@/features/dialogs/savings/withdraw/types'

export type USDCFromSDaiWithdrawObjective =
  | {
      type: 'usdcFromSDaiWithdraw'
      usdc: Token
      value: NormalizedUnitNumber
      sDai: Token
      sDaiValueEstimate: NormalizedUnitNumber
      receiver?: CheckedAddress
      mode: Mode
      method: 'withdraw'
    }
  | {
      type: 'usdcFromSDaiWithdraw'
      usdc: Token
      value: NormalizedUnitNumber
      sDai: Token
      receiver?: CheckedAddress
      mode: Mode
      method: 'redeem'
    }

export interface USDCFromSDaiWithdrawAction {
  type: 'usdcFromSDaiWithdraw'
  usdc: Token
  value: NormalizedUnitNumber
  sDai: Token
  receiver?: CheckedAddress
  mode: Mode
  method: 'withdraw' | 'redeem'
}
