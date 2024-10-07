import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Timeframe } from '@/ui/charts/defaults'
import { range } from '@/utils/array'
import { assertNever } from '@/utils/assertNever'
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
      })

    case '1M':
      return calculatePredictionsIncomeByDays({
        days: Math.max(optimalPredictionsLength, 30),
        shares,
        timestamp,
        savingsInfo,
      })

    case '1Y':
    case 'All':
      return calculatePredictionsIncomeByDays({
        days: Math.max(optimalPredictionsLength, 180),
        shares,
        timestamp,
        savingsInfo,
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
}: {
  days: number
  savingsInfo: SavingsInfo
  shares: NormalizedUnitNumber
  timestamp: number
}): MyEarningsInfoItem[] {
  // @note For today we have only current balance (with slight delay) but we need also balance for next data-point
  return range(0, days).map((day) => {
    const dayTimestamp = timestamp + day * SECONDS_PER_DAY

    const dayIncomePrediction = savingsInfo.predictSharesValue({
      timestamp: dayTimestamp,
      shares,
    })

    return {
      balance: dayIncomePrediction,
      date: new Date(dayTimestamp * 1000),
    }
  })
}
