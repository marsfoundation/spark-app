import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface ConvertStablesObjective {
  type: 'convertStables'
  inToken: Token
  outToken: Token
  amount: NormalizedUnitNumber
}
