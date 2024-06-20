import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface USDCToSDaiDepositObjective {
  type: 'usdcToSDaiDeposit'
  value: NormalizedUnitNumber
  usdc: Token
  sDai: Token
}

export interface USDCToSDaiDepositAction {
  type: 'usdcToSDaiDeposit'
  value: NormalizedUnitNumber
  usdc: Token
  sDai: Token
}
