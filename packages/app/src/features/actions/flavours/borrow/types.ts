import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface BorrowObjective {
  type: 'borrow'
  token: Token
  value: NormalizedUnitNumber
}

export interface BorrowAction {
  type: 'borrow'
  token: Token
  value: NormalizedUnitNumber
}
