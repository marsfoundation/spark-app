import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface NativeDaiDepositObjective {
  type: 'nativeDaiDeposit'
  value: NormalizedUnitNumber
  dai: Token
  sDai: Token
}

export interface NativeDaiDepositAction {
  type: 'nativeDaiDeposit'
  value: NormalizedUnitNumber
  dai: Token
  sDai: Token
}
