import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface DepositObjective {
  type: 'deposit'
  token: Token
  value: NormalizedUnitNumber
}

export interface DepositAction {
  type: 'deposit'
  token: Token
  value: NormalizedUnitNumber
}
