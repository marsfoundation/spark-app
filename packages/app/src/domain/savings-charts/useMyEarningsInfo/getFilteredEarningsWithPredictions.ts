import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { Timeframe } from '@/ui/charts/defaults'
import { filterDataByTimeframe } from '@/ui/charts/utils'
import { calculatePredictions } from './calculatePredictions'
import { MyEarningsInfoItem } from './types'

interface GetFilteredEarningsWithPredictionsParams {
  currentTimestamp: number
  timeframe: Timeframe
  myEarningsInfo: MyEarningsInfoItem[]
  savingsInfo: SavingsInfo | null
  savingsTokenWithBalance: TokenWithBalance | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getFilteredEarningsWithPredictions({
  currentTimestamp,
  timeframe,
  myEarningsInfo,
  savingsInfo,
  savingsTokenWithBalance,
}: GetFilteredEarningsWithPredictionsParams) {
  if (!savingsInfo || !savingsTokenWithBalance) {
    return {
      data: [],
      predictions: [],
    }
  }

  const filteredData = filterDataByTimeframe({
    data: myEarningsInfo,
    timeframe,
    currentTimestamp,
  })

  filteredData.pop()

  const todaysItem = {
    date: new Date(),
    balance: savingsInfo.convertToAssets({ shares: savingsTokenWithBalance.balance }),
  }

  const calculatedPredictions = calculatePredictions({
    savingsInfo,
    timeframe,
    timestamp: Math.floor(todaysItem.date.getTime() / 1000),
    shares: savingsTokenWithBalance.balance,
    dataLength: filteredData.length,
  })

  filteredData.push(todaysItem)
  // @note todaysItems shows the current balance so we put it into predictions to preserve the chart line continuity
  const predictions = [todaysItem, ...calculatedPredictions]

  return {
    data: filteredData,
    predictions,
  }
}
