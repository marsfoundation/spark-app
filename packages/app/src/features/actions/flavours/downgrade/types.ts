import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

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
