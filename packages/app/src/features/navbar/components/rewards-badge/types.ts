import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface Reward {
  token: Token
  amount: NormalizedUnitNumber
}
