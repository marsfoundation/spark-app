import { Token } from '@/domain/types/Token'
import { SimplifiedQueryResult } from '@/utils/types'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export type ActiveRewardsQueryResult = SimplifiedQueryResult<ActiveReward[]>

export interface ActiveReward {
  token: Token
  amountPending: NormalizedUnitNumber
  amountToClaim: NormalizedUnitNumber
}
