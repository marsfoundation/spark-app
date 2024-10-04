import { SavingsInfo } from '@/domain/savings-info/types'
import { Timeframe } from '@/ui/charts/defaults'
import { filterDataByTimeframe } from '@/ui/charts/utils'
import { calculatePredictions } from './calculatePredictions'
import { MyEarningsInfoItem } from './types'

interface GetFilteredEarningsWithPredictionsParams {
  currentTimestamp: number
  timeframe: Timeframe
  myEarningsInfo: MyEarningsInfoItem[]
  savingsInfo: SavingsInfo
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getFilteredEarningsWithPredictions({
  currentTimestamp,
  timeframe,
  myEarningsInfo,
  savingsInfo,
}: GetFilteredEarningsWithPredictionsParams) {
  const filteredData = filterDataByTimeframe({
    data: myEarningsInfo,
    timeframe,
    currentTimestamp,
  })

  const lastItem = filteredData.at(-1)

  const predictions = lastItem
    ? calculatePredictions({
        savingsInfo,
        timeframe,
        timestamp: lastItem.date.getTime() / 1000,
        balance: lastItem.balance,
        dataLength: filteredData.length,
      })
    : []

  // @note predications has to start at the same day as the last item which sometimes might have wrong balance value so we need to replace it
  if (predictions.length > 0) {
    filteredData.pop()
    filteredData.push(predictions[0]!)
  }

  return {
    data: filteredData,
    predictions,
  }
}
