import { Timeframe } from '@/ui/charts/defaults'
import { useQuery } from '@tanstack/react-query'
import { savingsRateFilteredQueryOptions, savingsRateQueryOptions } from './query'
import { SavingsRateInfo } from './types'

export interface UseSavingsRateInfoParams {
  chainId: number
  timeframe: Timeframe
  currentTimestamp: number
  staleTime: number
}
export type UseSavingsRateInfoResult = {
  data: SavingsRateInfo | undefined
  isLoading: boolean
  isError: boolean
}

export function useSavingsRateInfo({
  chainId,
  timeframe,
  currentTimestamp,
  staleTime,
}: UseSavingsRateInfoParams): UseSavingsRateInfoResult {
  const savingsRateInfo = useQuery({
    ...savingsRateQueryOptions({
      chainId,
      staleTime,
    }),
  })

  const savingsRateInfoFiltered = useQuery({
    ...savingsRateFilteredQueryOptions({
      chainId,
      timeframe,
      currentTimestamp,
      staleTime,
    }),
  })

  return {
    data: savingsRateInfoFiltered.data,
    isLoading: savingsRateInfo.isLoading || savingsRateInfoFiltered.isLoading,
    isError: savingsRateInfo.isError || savingsRateInfoFiltered.isError,
  }
}
