import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Mode } from '@/features/dialogs/savings/withdraw/types'

export type DaiFromSDaiWithdrawObjective = {
  type: 'daiFromSDaiWithdraw'
  dai: Token
  value: NormalizedUnitNumber
  sDai: Token
  receiver?: CheckedAddress
  mode: Mode
  method: 'withdraw' | 'redeem'
}

export interface DaiFromSDaiWithdrawAction {
  type: 'daiFromSDaiWithdraw'
  dai: Token
  value: NormalizedUnitNumber
  sDai: Token
  receiver?: CheckedAddress
  mode: Mode
  method: 'withdraw' | 'redeem'
}
