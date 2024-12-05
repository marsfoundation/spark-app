import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { ReserveStatus } from '../market-info/reserve-status'

export type DepositValidationIssue =
  | 'value-not-positive'
  | 'exceeds-balance'
  | 'deposit-cap-reached'
  | 'reserve-not-active'

export interface ValidateDepositArgs {
  value: NormalizedUnitNumber
  asset: {
    status: ReserveStatus
    totalLiquidity: NormalizedUnitNumber
    supplyCap?: NormalizedUnitNumber
  }
  user: {
    balance: NormalizedUnitNumber
    alreadyDepositedValueUSD: NormalizedUnitNumber
  }
}

export function validateDeposit({
  value,
  asset: { status, totalLiquidity, supplyCap },
  user: { balance, alreadyDepositedValueUSD },
}: ValidateDepositArgs): DepositValidationIssue | undefined {
  if (value.isLessThanOrEqualTo(0) && alreadyDepositedValueUSD.eq(0)) {
    return 'value-not-positive'
  }

  if (status !== 'active') {
    return 'reserve-not-active'
  }

  if (balance.lt(value)) {
    return 'exceeds-balance'
  }

  if (supplyCap && value.plus(totalLiquidity).gt(supplyCap)) {
    return 'deposit-cap-reached'
  }
}

export const depositValidationIssueToMessage: Record<DepositValidationIssue, string> = {
  'value-not-positive': 'Deposit value should be positive',
  'reserve-not-active': 'Depositing is not available for this asset',
  'deposit-cap-reached': 'Deposit cap reached',
  'exceeds-balance': 'Exceeds your balance',
}
