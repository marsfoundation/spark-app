import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface NativeSDaiDepositObjective {
  type: 'nativeSDaiDeposit'
  token: Token
  value: NormalizedUnitNumber
  sDai: Token
}

export interface NativeSDaiDepositAction {
  type: 'nativeSDaiDeposit'
  token: Token
  value: NormalizedUnitNumber
  sDai: Token
}
