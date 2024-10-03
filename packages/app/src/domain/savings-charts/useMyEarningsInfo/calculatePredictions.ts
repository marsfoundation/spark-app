import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Timeframe } from '@/ui/charts/defaults'
import { range } from '@/utils/array'
import { assertNever } from '@/utils/assertNever'
import { MyEarningsInfoItem } from './types'

const SECONDS_PER_DAY = 24 * 60 * 60

export interface CalculatePredictionsParams {
  timestamp: number // in seconds
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
  const optimalPredictionsLength = Math.ceil(dataLength * 0.33)

  switch (timeframe) {
    case '7D':
      return calculatePredictionsIncomeByDays({
        // Ensure to have proportional length of projections to the data length
        days: Math.min(optimalPredictionsLength, 3),
        balance,
        timestamp,
        savingsInfo,
      })

    case '1M':
      return calculatePredictionsIncomeByDays({
        days: Math.min(optimalPredictionsLength, 7),
        balance,
        timestamp,
        savingsInfo,
      })

    case '1Y':
    case 'All':
      return calculatePredictionsIncomeByDays({
        days: Math.min(optimalPredictionsLength, 60),
        balance,
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
  balance,
  timestamp,
}: {
  days: number
  savingsInfo: SavingsInfo
  balance: NormalizedUnitNumber
  timestamp: number
}): MyEarningsInfoItem[] {
  const shares = savingsInfo.convertToShares({ assets: balance })

  // We have data for current day already but on chart we want to start from actual day not the next one
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
