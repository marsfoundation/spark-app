import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface Reward {
  token: Token
  amount: NormalizedUnitNumber
}
