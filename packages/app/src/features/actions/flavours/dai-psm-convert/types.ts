import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface DaiPsmConvertAction {
  type: 'daiPsmConvert'
  inToken: Token
  outToken: Token
  amount: NormalizedUnitNumber
}
