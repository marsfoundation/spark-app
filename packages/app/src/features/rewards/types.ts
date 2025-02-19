import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface ActiveReward {
  token: Token
  amountPending: NormalizedUnitNumber
  amountToClaim: NormalizedUnitNumber
}
