import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface DowngradeObjective {
  type: 'downgrade'
  fromToken: Token
  toToken: Token
  amount: NormalizedUnitNumber
}

export interface DowngradeAction {
  type: 'downgrade'
  fromToken: Token
  toToken: Token
  amount: NormalizedUnitNumber
}
