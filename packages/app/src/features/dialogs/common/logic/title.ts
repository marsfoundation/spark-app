import { ObjectiveType } from '@/features/actions/logic/types'

export const objectiveTypeToVerb: Record<ObjectiveType, string> = {
  deposit: 'Deposited',
  borrow: 'Borrowed',
  withdraw: 'Withdrew',
  repay: 'Repaid',
  setUseAsCollateral: 'Set',
  setUserEMode: 'Set',
  exchange: 'Deposited',
  daiToSDaiDeposit: 'Wrapped',
  usdcToSDaiDeposit: 'Wrapped',
  xDaiToSDaiDeposit: 'Wrapped',
  daiFromSDaiWithdraw: 'Unwrapped',
  usdcFromSDaiWithdraw: 'Unwrapped',
  xDaiFromSDaiWithdraw: 'Unwrapped',
}
