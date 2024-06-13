import { Address } from 'viem'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface ApproveAction {
  type: 'approve' | 'permit' // default action is approve - it is replaced with permit if permit is both preferred and supported
  token: Token
  spender: Address
  value: NormalizedUnitNumber
  disallowPermit?: boolean // if true, permit is not allowed
  requiredValue?: NormalizedUnitNumber // if reached, no action is needed. Useful when value is approximation (and constantly accrues debt)
}
