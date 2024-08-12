import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Mode } from '@/features/dialogs/savings/withdraw/types'

export type WithdrawFromSavingsObjective = {
  type: 'withdrawFromSavings'
  token: Token
  savingsToken: Token
  amount: NormalizedUnitNumber
  isMax: boolean
} & (
  | {
      mode: 'send'
      receiver?: CheckedAddress
    }
  | {
      mode: 'withdraw'
    }
)

export interface WithdrawFromSavingsAction {
  type: 'withdrawFromSavings'
  token: Token
  savingsToken: Token
  amount: NormalizedUnitNumber
  isMax: boolean
  mode: Mode
  receiver?: CheckedAddress
}
