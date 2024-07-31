import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface XMakerStableToSavingsObjective {
  type: 'xDaiToSDaiDeposit'
  xDai: Token
  sDai: Token
  value: NormalizedUnitNumber
}

export interface XDaiToSDaiDepositAction {
  type: 'xDaiToSDaiDeposit'
  xDai: Token
  sDai: Token
  value: NormalizedUnitNumber
}
