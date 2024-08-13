import { Address } from 'viem'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface PermitAction {
  type: 'permit'
  token: Token
  spender: Address
  value: NormalizedUnitNumber
}
