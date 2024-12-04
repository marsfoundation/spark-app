import { SavingsInfo } from '@/domain/savings-info/types'
import { Timeframe } from '@/ui/charts/defaults'
import { range } from '@/utils/array'
import { assertNever } from '@/utils/assertNever'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { MyEarningsInfoItem } from './types'

const SECONDS_PER_DAY = 24 * 60 * 60

export interface CalculatePredictionsParams {
  timestamp: number // in seconds
  shares: NormalizedUnitNumber
  savingsInfo: SavingsInfo
  timeframe: Timeframe
  dataLength: number
}

export function calculatePredictions({
  timestamp,
  shares,
  savingsInfo,
  timeframe,
  dataLength,
}: CalculatePredictionsParams): MyEarningsInfoItem[] {
  const optimalPredictionsLength = Math.floor(dataLength * 1.66)

  switch (timeframe) {
    case '7D':
      return calculatePredictionsIncomeByDays({
        days: Math.max(optimalPredictionsLength, 7),
        shares,
        timestamp,
        savingsInfo,
        step: 1,
      })

    case '1M':
      return calculatePredictionsIncomeByDays({
        days: Math.max(optimalPredictionsLength, 30),
        shares,
        timestamp,
        savingsInfo,
        step: 1,
      })

    case '1Y':
    case 'All':
      return calculatePredictionsIncomeByDays({
        // setting upper bounds due to visible performance problems
        days: Math.max(Math.min(optimalPredictionsLength, 360), 90),
        shares,
        timestamp,
        savingsInfo,
        step: 3,
      })

    default:
      assertNever(timeframe)
  }
}

function calculatePredictionsIncomeByDays({
  days,
  savingsInfo,
  shares,
  timestamp,
  step,
}: {
  days: number
  savingsInfo: SavingsInfo
  shares: NormalizedUnitNumber
  timestamp: number
  step: number
}): MyEarningsInfoItem[] {
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
