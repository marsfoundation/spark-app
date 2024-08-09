import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface DepositObjective {
  type: 'deposit'
  token: Token
  value: NormalizedUnitNumber
}

export interface DepositAction {
  type: 'deposit'
  token: Token
  value: NormalizedUnitNumber
}
