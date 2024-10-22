import { Timeframe } from '@/ui/charts/defaults'
import { SimplifiedQueryResult } from '@/utils/types'
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
  getSavingsRateApiUrl: (() => string) | undefined
}

export type UseSavingsRateInfoResult = SimplifiedQueryResult<SavingsRateInfo>

export function useSavingsRateInfo({
  chainId,
  timeframe,
  currentTimestamp,
  staleTime,
  getSavingsRateApiUrl,
}: UseSavingsRateInfoParams): UseSavingsRateInfoResult {
  return useQuery({
    ...savingsRateQueryOptions({
      chainId,
      getSavingsRateApiUrl,
    }),
    select: useCallback(
      (savingsRateInfo: SavingsRateInfo) =>
        getFilteredSavingsRateData({ savingsRateInfo, timeframe, currentTimestamp }),
      [timeframe, currentTimestamp],
    ),
    staleTime,
    enabled: !!getSavingsRateApiUrl,
  })
}
