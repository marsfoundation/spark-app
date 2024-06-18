import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface NativeXDaiDepositObjective {
  type: 'nativeXDaiDeposit'
  xDai: Token
  sDai: Token
  value: NormalizedUnitNumber
}

export interface NativeXDaiDepositAction {
  type: 'nativeXDaiDeposit'
  xDai: Token
  sDai: Token
  value: NormalizedUnitNumber
}
