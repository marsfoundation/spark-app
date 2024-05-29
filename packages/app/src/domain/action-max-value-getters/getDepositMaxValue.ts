import BigNumber from 'bignumber.js'

import { getCompoundedBalance, getCompoundedScaledBalance } from '../market-info/math'
import { ReserveStatus } from '../market-info/reserve-status'
import { BaseUnitNumber, NormalizedUnitNumber } from '../types/NumericValues'

interface GetDepositMaxValueParams {
  asset: {
    status: ReserveStatus
    totalLiquidity: NormalizedUnitNumber
    decimals: number
    totalDebt: NormalizedUnitNumber
    rate: BigNumber
    index: BigNumber
    lastUpdateTimestamp: number
    supplyCap?: NormalizedUnitNumber
  }
  user: {
    balance: NormalizedUnitNumber
  }
  timestamp: number
}

export function getDepositMaxValue({ user, asset, timestamp }: GetDepositMaxValueParams): NormalizedUnitNumber {
  if (asset.status !== 'active') {
    return NormalizedUnitNumber(0)
  }

  const scaledTotalDebt = getCompoundedScaledBalance({
    balance: BaseUnitNumber(asset.totalDebt.shiftedBy(asset.decimals)),
    index: asset.index,
    rate: asset.rate,
    lastUpdateTimestamp: asset.lastUpdateTimestamp,
    timestamp,
  })
  const totalDebtIn10Minutes = NormalizedUnitNumber(
    getCompoundedBalance({
      balance: scaledTotalDebt,
      index: asset.index,
      rate: asset.rate,
      lastUpdateTimestamp: asset.lastUpdateTimestamp,
      timestamp: timestamp + 10 * 60,
    }).shiftedBy(-asset.decimals),
  )
  const totalLiquidityIn10Minutes = asset.totalLiquidity.minus(asset.totalDebt).plus(totalDebtIn10Minutes)

  const marketMaxDeposit = asset.supplyCap
    ? BigNumber.max(asset.supplyCap.minus(totalLiquidityIn10Minutes), 0)
    : Number.POSITIVE_INFINITY
  return NormalizedUnitNumber(BigNumber.min(user.balance, marketMaxDeposit))
}
