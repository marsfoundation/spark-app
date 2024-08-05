import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface MakerStableToSavingsObjective {
  type: 'makerStableToSavings'
  value: NormalizedUnitNumber
  stableToken: Token
  savingsToken: Token
  migrateDAIToSNST: boolean
}

export interface MakerStableToSavingsAction {
  type: 'makerStableToSavings'
  value: NormalizedUnitNumber
  stableToken: Token
  savingsToken: Token
}
