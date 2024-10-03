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
  dataLength: number
}

export function calculatePredictions({
  timestamp,
  balance,
  savingsInfo,
  timeframe,
  dataLength,
}: CalculatePredictionsParams): MyEarningsInfoItem[] {
  const base = savingsInfo.convertToAssets({ shares: balance })

  const dayIncomePrediction = NormalizedUnitNumber(
    savingsInfo.predictSharesValue({ timestamp: timestamp + SECONDS_PER_DAY, shares: balance }).minus(base),
  )

  const optimalPredictionsLength = Math.ceil(dataLength * 0.33)

  switch (timeframe) {
    case '7D':
      return calculatePredictionsIncomeByDays({
        // Ensure to have proportional length of projections to the data length
        days: dataLength > 7 ? 3 : optimalPredictionsLength,
        dayIncome: dayIncomePrediction,
        balance,
        timestamp,
      })

    case '1M':
      return calculatePredictionsIncomeByDays({
        days: dataLength > 30 ? 7 : optimalPredictionsLength,
        dayIncome: dayIncomePrediction,
        balance,
        timestamp,
      })

    case '1Y':
    case 'All':
      return calculatePredictionsIncomeByDays({
        days: dataLength > 150 ? 60 : Math.min(optimalPredictionsLength, 30),
        dayIncome: dayIncomePrediction,
        balance,
        timestamp,
      })

    default:
      assertNever(timeframe)
  }
}

function calculatePredictionsIncomeByDays({
  days,
  dayIncome,
  balance,
  timestamp,
}: {
  days: number
  dayIncome: NormalizedUnitNumber
  balance: NormalizedUnitNumber
  timestamp: number
}): MyEarningsInfoItem[] {
  // We have data for current day already but on chart we want to start from actual day not the next one
  return range(0, days).map((day) => {
    return {
      balance: NormalizedUnitNumber(balance.plus(dayIncome.times(day))),
      date: new Date((timestamp + day * SECONDS_PER_DAY) * 1000),
    }
  })
}
