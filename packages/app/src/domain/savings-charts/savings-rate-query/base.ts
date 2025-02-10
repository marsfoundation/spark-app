import { queryOptions } from '@tanstack/react-query'
import { SavingsRateQueryResult, savingsRateQueryOptions } from './query'
import { SavingsRateChartData } from './types'

function ssrRateSelect(data: SavingsRateQueryResult): SavingsRateChartData {
  return { apy: data.ssr }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function baseSusdcSavingsRateQueryOptions() {
  return queryOptions({
    ...savingsRateQueryOptions(),
    select: ssrRateSelect,
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function baseSusdsSavingsRateQueryOptions() {
  return queryOptions({
    ...savingsRateQueryOptions(),
    select: ssrRateSelect,
  })
}
