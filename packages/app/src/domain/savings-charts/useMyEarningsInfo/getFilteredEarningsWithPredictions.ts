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

  // @note we remove the last item which is the todays current balance and create our own to avoid delayed values
  filteredData.pop()

  const todaysItem = {
    date: new Date(currentTimestamp * 1000),
    balance: savingsInfo.convertToAssets({ shares: savingsTokenWithBalance.balance }),
  }

  const calculatedPredictions = calculatePredictions({
    savingsInfo,
    timeframe,
    timestamp: Math.floor(getEndOfDayTimestamp(todaysItem.date) / 1000),
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

function getEndOfDayTimestamp(date: Date): number {
  const endOfDayUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 9999)
  return endOfDayUTC
}
