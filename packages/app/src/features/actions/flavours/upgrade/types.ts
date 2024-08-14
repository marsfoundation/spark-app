import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface UpgradeObjective {
  type: 'upgrade'
  fromToken: Token
  toToken: Token
  amount: NormalizedUnitNumber
}

export interface UpgradeAction {
  type: 'upgrade'
  fromToken: Token
  toToken: Token
  amount: NormalizedUnitNumber
}
