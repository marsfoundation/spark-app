import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface ConvertStablesObjective {
  type: 'convertStables'
  inToken: Token
  outToken: Token
  amount: NormalizedUnitNumber
}
