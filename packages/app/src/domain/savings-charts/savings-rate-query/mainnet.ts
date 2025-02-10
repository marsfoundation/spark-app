import { queryOptions } from '@tanstack/react-query'
import { SavingsRateQueryResult, savingsRateQueryOptions } from './query'
import { SavingsRateChartData } from './types'

function dsrRateSelect(data: SavingsRateQueryResult): SavingsRateChartData {
  return { apy: data.dsr }
}
function ssrRateSelect(data: SavingsRateQueryResult): SavingsRateChartData {
  return { apy: data.ssr }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function mainnetSdaiSavingsRateQueryOptions() {
  return queryOptions({
    ...savingsRateQueryOptions(),
    select: dsrRateSelect,
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function mainnetSusdsSavingsRateQueryOptions() {
  return queryOptions({
    ...savingsRateQueryOptions(),
    select: ssrRateSelect,
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function mainnetSusdcSavingsRateQueryOptions() {
  return queryOptions({
    ...savingsRateQueryOptions(),
    select: ssrRateSelect,
  })
}
