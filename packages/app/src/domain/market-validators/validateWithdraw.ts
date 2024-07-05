import { EModeCategory, EModeState } from '../market-info/marketInfo'
import { ReserveStatus } from '../market-info/reserve-status'
import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'

export type WithdrawValidationIssue =
  | 'value-not-positive'
  | 'exceeds-balance'
  | 'reserve-paused'
  | 'exceeds-ltv'
  | 'reserve-not-active'

export interface ValidateWithdrawArgs {
  value: NormalizedUnitNumber
  asset: {
    status: ReserveStatus
    liquidationThreshold: Percentage
    eModeCategory?: EModeCategory
  }
  user: {
    deposited: NormalizedUnitNumber
    ltvAfterWithdrawal: Percentage
    eModeState: EModeState
  }
}

export function validateWithdraw({ value, asset, user }: ValidateWithdrawArgs): WithdrawValidationIssue | undefined {
  if (value.isLessThanOrEqualTo(0)) {
    return 'value-not-positive'
  }

  if (asset.status === 'not-active') {
    return 'reserve-not-active'
  }

  if (asset.status === 'paused') {
    return 'reserve-paused'
  }

  if (user.deposited.lt(value)) {
    return 'exceeds-balance'
  }

  const liquidationThreshold =
    user.eModeState.enabled && user.eModeState.category.id === asset.eModeCategory?.id
      ? user.eModeState.category.liquidationThreshold
      : asset.liquidationThreshold
  if (user.ltvAfterWithdrawal.gt(liquidationThreshold)) {
    return 'exceeds-ltv'
  }
}

export const withdrawalValidationIssueToMessage: Record<WithdrawValidationIssue, string> = {
  'value-not-positive': 'Withdraw value should be positive',
  'reserve-paused': 'Reserve is paused',
  'reserve-not-active': 'Reserve is not active',
  'exceeds-balance': 'Exceeds your balance',
  'exceeds-ltv': 'Remaining collateral cannot support the loan',
}
