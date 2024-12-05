import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface PsmConvertAction {
  type: 'psmConvert'
  inToken: Token
  outToken: Token
  amount: NormalizedUnitNumber
}
