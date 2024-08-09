import { ObjectiveType } from '@/features/actions/logic/types'

export const objectiveTypeToVerb: Record<ObjectiveType, string> = {
  deposit: 'Deposited',
  borrow: 'Borrowed',
  withdraw: 'Withdrew',
  repay: 'Repaid',
  setUseAsCollateral: 'Set',
  setUserEMode: 'Set',
  depositToSavings: 'Converted',
  daiFromSDaiWithdraw: 'Converted',
  usdcFromSDaiWithdraw: 'Converted',
  xDaiFromSDaiWithdraw: 'Converted',
  claimRewards: 'Claimed',
}
