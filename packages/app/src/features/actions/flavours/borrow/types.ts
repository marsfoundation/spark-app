import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface BorrowObjective {
  type: 'borrow'
  token: Token
  debtTokenAddress: CheckedAddress
  value: NormalizedUnitNumber
}

export interface BorrowAction {
  type: 'borrow'
  token: Token
  value: NormalizedUnitNumber
}
