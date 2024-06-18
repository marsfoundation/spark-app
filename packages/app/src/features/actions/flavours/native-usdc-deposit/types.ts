import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface NativeUSDCDepositObjective {
  type: 'nativeUSDCDeposit'
  value: NormalizedUnitNumber
  usdc: Token
  sDai: Token
}

export interface NativeUSDCDepositAction {
  type: 'nativeUSDCDeposit'
  value: NormalizedUnitNumber
  usdc: Token
  sDai: Token
}
