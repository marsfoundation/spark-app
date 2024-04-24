import { ReserveStatus } from '../market-info/reserve-status'
import { NormalizedUnitNumber } from '../types/NumericValues'

interface GetWithdrawMaxValueParams {
  user: {
    deposited: NormalizedUnitNumber
  }
  asset: {
    status: ReserveStatus
  }
}

export function getWithdrawMaxValue({ user, asset }: GetWithdrawMaxValueParams): NormalizedUnitNumber {
  if (asset.status === 'paused') {
    return NormalizedUnitNumber(0)
  }
  return user.deposited
}
