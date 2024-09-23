import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface UsdsPsmConvertAction {
  type: 'usdsPsmConvert'
  inToken: Token
  outToken: Token
  amount: NormalizedUnitNumber
}
