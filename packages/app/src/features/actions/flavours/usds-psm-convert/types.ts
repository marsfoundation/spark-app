import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface UsdsPsmConvertAction {
  type: 'usdsPsmConvert'
  outToken: 'usdc' | 'usds'
  usdc: Token
  usds: Token
  usdcAmount: NormalizedUnitNumber
}
