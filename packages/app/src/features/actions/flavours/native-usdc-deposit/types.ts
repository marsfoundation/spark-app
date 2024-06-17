import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface NativeUSDCDepositObjective {
  type: 'nativeUSDCDeposit'
  value: NormalizedUnitNumber
  usdc: Token
  dai: Token
}

export interface NativeUSDCDepositAction {
  type: 'nativeUSDCDeposit'
  value: NormalizedUnitNumber
  usdc: Token
  dai: Token
}
