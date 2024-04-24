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
    maxLtv: Percentage
  }
  user: {
    deposited: NormalizedUnitNumber
    ltvAfterWithdrawal: Percentage
  }
}

export function validateWithdraw({
  value,
  asset: { status, maxLtv },
  user: { deposited, ltvAfterWithdrawal },
}: ValidateWithdrawArgs): WithdrawValidationIssue | undefined {
  if (value.isLessThanOrEqualTo(0)) {
    return 'value-not-positive'
  }

  if (status === 'not-active') {
    return 'reserve-not-active'
  }

  if (status === 'paused') {
    return 'reserve-paused'
  }

  if (deposited.lt(value)) {
    return 'exceeds-balance'
  }

  if (ltvAfterWithdrawal.gt(maxLtv)) {
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
