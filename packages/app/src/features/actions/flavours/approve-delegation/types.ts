import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface ApproveDelegationAction {
  type: 'approveDelegation'
  token: Token
  value: NormalizedUnitNumber
}
