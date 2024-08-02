import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface MigrateDAIToSNSTAction {
  type: 'migrateDAIToSNST'
  value: NormalizedUnitNumber
  stableToken: Token
  savingsToken: Token
}
