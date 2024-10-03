import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Timeframe } from '@/ui/charts/defaults'
import { range } from '@/utils/array'
import { assertNever } from '@/utils/assertNever'
import { MyEarningsInfoItem } from './types'

const SECONDS_PER_DAY = 24 * 60 * 60

export interface CalculatePredictionsParams {
  timestamp: number // in ms
  balance: NormalizedUnitNumber
  savingsInfo: SavingsInfo
  timeframe: Timeframe
}

export function calculatePredictions({
  timestamp,
  balance,
  savingsInfo,
  timeframe,
}: CalculatePredictionsParams): MyEarningsInfoItem[] {
  const base = savingsInfo.convertToAssets({ shares: balance })

  const dayIncomePrediction = NormalizedUnitNumber(
    savingsInfo.predictSharesValue({ timestamp: timestamp + SECONDS_PER_DAY, shares: balance }).minus(base),
  )

  switch (timeframe) {
    case '7D':
      return calculatePredictionsIncomeByDays({
        days: 3,
        dayIncome: dayIncomePrediction,
        base,
        timestamp,
      })

    case '1M':
      return calculatePredictionsIncomeByDays({
        days: 7,
        dayIncome: dayIncomePrediction,
        base,
        timestamp,
      })

    case '1Y':
    case 'All':
      return calculatePredictionsIncomeByDays({
        days: 30,
        dayIncome: dayIncomePrediction,
        base,
        timestamp,
      })

    default:
      assertNever(timeframe)
  }
}

function calculatePredictionsIncomeByDays({
  days,
  dayIncome,
  base,
  timestamp,
}: {
  days: number
  dayIncome: NormalizedUnitNumber
  base: NormalizedUnitNumber
  timestamp: number
}): MyEarningsInfoItem[] {
  // we have data for current day already but on chart we want to start from actual day not the next one
  return range(0, days).map((day) => ({
    balance: NormalizedUnitNumber(base.plus(dayIncome.times(day))),
    date: new Date((timestamp + day * SECONDS_PER_DAY) * 1000),
  }))
}
