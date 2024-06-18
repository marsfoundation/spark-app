import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface DaiToSDaiDepositObjective {
  type: 'daiToSDaiDeposit'
  value: NormalizedUnitNumber
  dai: Token
  sDai: Token
}

export interface DaiToSDaiDepositAction {
  type: 'daiToSDaiDeposit'
  value: NormalizedUnitNumber
  dai: Token
  sDai: Token
}
