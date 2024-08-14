import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface UpgradeDaiToNSTObjective {
  type: 'upgradeDaiToNST'
  dai: Token
  nst: Token
  amount: NormalizedUnitNumber
}

export interface UpgradeDaiToNSTAction {
  type: 'upgradeDaiToNST'
  dai: Token
  nst: Token
  amount: NormalizedUnitNumber
}
