import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface UsdsPsmWrapAction {
  type: 'usdsPsmWrap'
  usdc: Token
  usds: Token
  usdcAmount: NormalizedUnitNumber
}
