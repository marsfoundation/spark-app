import { Timeframe } from '@/ui/charts/defaults'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { getFilteredSavingsRateData } from './getFilteredSavingsRateData'
import { savingsRateQueryOptions } from './query'
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
    }),
    select: useCallback(
      (savingsRateInfo: SavingsRateInfo) =>
        getFilteredSavingsRateData({ savingsRateInfo, timeframe, currentTimestamp }),
      [timeframe, currentTimestamp],
    ),
    staleTime,
  })

  return {
    data: savingsRateInfo.data,
    isLoading: savingsRateInfo.isLoading,
    isError: savingsRateInfo.isError,
  }
}
