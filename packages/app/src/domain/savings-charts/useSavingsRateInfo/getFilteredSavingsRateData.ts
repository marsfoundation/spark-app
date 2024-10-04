import { Timeframe } from '@/ui/charts/defaults'
import { filterDataByTimeframe } from '@/ui/charts/utils'
import { SavingsRateInfo } from './types'

interface GetFilteredSavingsRateDataParams {
  currentTimestamp: number
  timeframe: Timeframe
  savingsRateInfo: SavingsRateInfo
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getFilteredSavingsRateData({
  currentTimestamp,
  timeframe,
  savingsRateInfo,
}: GetFilteredSavingsRateDataParams) {
  const ssr = filterDataByTimeframe({
    data: savingsRateInfo.ssr,
    timeframe,
    currentTimestamp,
  })

  const dsr = filterDataByTimeframe({
    data: savingsRateInfo.dsr,
    timeframe,
    currentTimestamp,
  })

  return {
    ssr,
    dsr,
  }
}
