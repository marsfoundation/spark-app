import { Reserve } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface WithdrawObjective {
  type: 'withdraw'
  reserve: Reserve
  value: NormalizedUnitNumber
  all: boolean
}

export interface WithdrawAction {
  type: 'withdraw'
  token: Token
  value: NormalizedUnitNumber
}
