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
  chartsSupported: boolean
}

export type UseSavingsRateInfoResult = SimplifiedQueryResult<SavingsRateInfo>

export function useSavingsRateInfo({
  chainId,
  timeframe,
  currentTimestamp,
  staleTime,
  chartsSupported,
}: UseSavingsRateInfoParams): UseSavingsRateInfoResult {
  return useQuery({
    ...savingsRateQueryOptions({
      chainId,
    }),
    select: useCallback(
      (savingsRateInfo: SavingsRateInfo) =>
        getFilteredSavingsRateData({ savingsRateInfo, timeframe, currentTimestamp }),
      [timeframe, currentTimestamp],
    ),
    staleTime,
    enabled: chartsSupported,
  })
}
