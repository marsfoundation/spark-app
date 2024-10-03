import { SavingsInfo } from '@/domain/savings-info/types'
import { Timeframe } from '@/ui/charts/defaults'
import { filterDataByTimeframe } from '@/ui/charts/utils'
import { calculatePredictions } from './calculatePredictions'
import { MyEarningsInfoDataItem } from './types'

interface GetFilteredEarningsWithPredictionsParams {
  currentTimestamp: number
  timeframe: Timeframe
  myEarningsInfo: MyEarningsInfoDataItem[]
  savingsInfo: SavingsInfo
  savingsType: 'susds' | 'sdai'
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getFilteredEarningsWithPredictions({
  currentTimestamp,
  timeframe,
  myEarningsInfo,
  savingsInfo,
  savingsType,
}: GetFilteredEarningsWithPredictionsParams) {
  const savingsTypeData = myEarningsInfo.map((item) => ({
    date: item.date,
    balance: item.balance[savingsType],
  }))

  const filteredData = filterDataByTimeframe({
    data: savingsTypeData,
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

  return {
    data: filteredData,
    predictions,
  }
}
