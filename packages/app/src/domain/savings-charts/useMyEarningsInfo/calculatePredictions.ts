import { SavingsInfo } from '@/domain/savings-info/types'
import { range } from '@/utils/array'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { MyEarningsInfoItem } from './types'

const SECONDS_PER_DAY = 24 * 60 * 60

export function calculatePredictions({
  days,
  savingsInfo,
  shares,
  timestamp,
}: {
  days: number
  savingsInfo: SavingsInfo
  shares: NormalizedUnitNumber
  timestamp: number
}): MyEarningsInfoItem[] {
  const step = days > 366 ? 3 : 1

  // @note For today we have only current balance (with slight delay) but we need also balance for next data-point
  return range(0, days, step).map((day) => {
    const dayTimestamp = timestamp + day * SECONDS_PER_DAY

    const dayIncomePrediction = savingsInfo.predictAssetsAmount({
      timestamp: dayTimestamp,
      shares,
    })

    return {
      balance: dayIncomePrediction,
      date: new Date(dayTimestamp * 1000),
    }
  })
}
