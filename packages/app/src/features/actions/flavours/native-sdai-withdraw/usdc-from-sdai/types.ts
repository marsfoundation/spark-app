import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export type USDCFromSDaiWithdrawObjective =
  | {
      type: 'usdcFromSDaiWithdraw'
      usdc: Token
      value: NormalizedUnitNumber
      sDai: Token
      sDaiValueEstimate: NormalizedUnitNumber
      receiver?: CheckedAddress
      method: 'withdraw'
    }
  | {
      type: 'usdcFromSDaiWithdraw'
      usdc: Token
      value: NormalizedUnitNumber
      sDai: Token
      receiver?: CheckedAddress
      method: 'redeem'
    }

export interface USDCFromSDaiWithdrawAction {
  type: 'usdcFromSDaiWithdraw'
  usdc: Token
  value: NormalizedUnitNumber
  sDai: Token
  receiver?: CheckedAddress
  method: 'withdraw' | 'redeem'
}
