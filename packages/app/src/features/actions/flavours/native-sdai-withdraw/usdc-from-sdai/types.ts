import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export type USDCFromSDaiWithdrawObjective =
  | {
      type: 'usdcFromSDaiWithdraw'
      usdc: Token
      value: NormalizedUnitNumber
      sDai: Token
      method: 'withdraw'
      sDaiValueEstimate: NormalizedUnitNumber
    }
  | {
      type: 'usdcFromSDaiWithdraw'
      usdc: Token
      value: NormalizedUnitNumber
      sDai: Token
      method: 'redeem'
    }

export interface USDCFromSDaiWithdrawAction {
  type: 'usdcFromSDaiWithdraw'
  usdc: Token
  value: NormalizedUnitNumber
  sDai: Token
  method: 'withdraw' | 'redeem'
}
