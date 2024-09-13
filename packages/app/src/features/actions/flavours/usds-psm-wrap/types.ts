import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface UsdsPsmWrapObjective {
  type: 'usdsPsmWrap'
  usdc: Token
  usdcAmount: NormalizedUnitNumber // amount of input token, not necessarily stake amount (in case when input is savings token)
}

export interface UsdsPsmWrapAction {
  type: 'usdsPsmWrap'
  usdc: Token
  usds: Token
  usdcAmount: NormalizedUnitNumber
}
