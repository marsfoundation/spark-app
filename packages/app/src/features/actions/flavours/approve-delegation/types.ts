import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface ApproveDelegationAction {
  type: 'approveDelegation'
  token: Token
  value: NormalizedUnitNumber
}
