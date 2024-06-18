import { ObjectiveType } from '@/features/actions/logic/types'

export const objectiveTypeToVerb: Record<ObjectiveType, string> = {
  deposit: 'Deposited',
  borrow: 'Borrowed',
  withdraw: 'Withdrew',
  repay: 'Repaid',
  setUseAsCollateral: 'Set',
  setUserEMode: 'Set',
  exchange: 'Deposited',
  nativeSDaiDeposit: 'Wrapped',
  nativeDaiDeposit: 'Wrapped',
  nativeUSDCDeposit: 'Wrapped',
  nativeXDaiDeposit: 'Wrapped',
  nativeSDaiWithdraw: 'Unwrapped',
}
