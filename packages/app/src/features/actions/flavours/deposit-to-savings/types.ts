import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface DepositToSavingsObjective {
  type: 'depositToSavings'
  value: NormalizedUnitNumber
  token: Token
  savingsToken: Token
}

export interface DepositToSavingsAction {
  type: 'depositToSavings'
  value: NormalizedUnitNumber
  token: Token
  savingsToken: Token
}
