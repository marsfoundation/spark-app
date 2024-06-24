import BigNumber from 'bignumber.js'
import { ReserveStatus } from '../market-info/reserve-status'
import { NormalizedUnitNumber } from '../types/NumericValues'

interface GetDepositMaxValueParams {
  asset: {
    status: ReserveStatus
    totalLiquidity: NormalizedUnitNumber
    supplyCap?: NormalizedUnitNumber
  }
  user: {
    balance: NormalizedUnitNumber
  }
}

export function getDepositMaxValue({ user, asset }: GetDepositMaxValueParams): NormalizedUnitNumber {
  if (asset.status !== 'active') {
    return NormalizedUnitNumber(0)
  }

  const marketMaxDeposit = asset.supplyCap
    ? BigNumber.max(asset.supplyCap.minus(asset.totalLiquidity), 0)
    : Number.POSITIVE_INFINITY
  return NormalizedUnitNumber(BigNumber.min(user.balance, marketMaxDeposit))
}
