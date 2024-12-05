import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

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
