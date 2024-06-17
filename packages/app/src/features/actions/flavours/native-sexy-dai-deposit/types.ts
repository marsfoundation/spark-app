import { BaseUnitNumber } from '@/domain/types/NumericValues'

export interface NativeXDaiDepositObjective {
  type: 'nativeXDaiDeposit'
  value: BaseUnitNumber
}

export interface NativeXDaiDepositAction {
  type: 'nativeXDaiDeposit'
  value: BaseUnitNumber
}
