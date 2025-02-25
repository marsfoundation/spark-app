import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface SparkReward {
  token: Token
  amountToClaim: NormalizedUnitNumber
}
