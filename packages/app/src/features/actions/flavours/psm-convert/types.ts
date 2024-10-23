import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface PsmConvertAction {
  type: 'psmConvert'
  inToken: Token
  outToken: Token
  amount: NormalizedUnitNumber
}
