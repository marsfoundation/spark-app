import BigNumber from 'bignumber.js'

import { ReserveStatus } from '../market-info/reserve-status'
import { NormalizedUnitNumber } from '../types/NumericValues'

interface GetRepayMaxValueParams {
  user: {
    debt: NormalizedUnitNumber
    balance: NormalizedUnitNumber
  }
  asset: {
    status: ReserveStatus
  }
}

export function getRepayMaxValue({ user, asset }: GetRepayMaxValueParams): NormalizedUnitNumber {
  if (asset.status === 'paused') {
    return NormalizedUnitNumber(0)
  }
  const maxRepay = BigNumber.min(user.debt, user.balance)
  return NormalizedUnitNumber(maxRepay)
}
