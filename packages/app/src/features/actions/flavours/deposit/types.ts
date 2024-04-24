import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface DepositObjective {
  type: 'deposit'
  token: Token
  lendingPool: CheckedAddress
  value: NormalizedUnitNumber
}

export interface DepositAction {
  type: 'deposit'
  token: Token
  value: NormalizedUnitNumber
}
