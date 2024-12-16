import { Timeframe } from '@/ui/charts/defaults'
import { SimplifiedQueryResult } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { SAVINGS_RATE_TIMEFRAMES, SavingsRateTimeframe } from './common'
import { getFilteredSavingsRateData } from './getFilteredSavingsRateData'
import { savingsRateQueryOptions } from './query'
import { SavingsRateInfo } from './types'

export interface UseSavingsRateInfoParams {
  chainId: number
  currentTimestamp: number
  staleTime: number
  savingsRateApiUrl: string | undefined
}

export interface UseSavingsRateInfoResult {
  queryResult: SimplifiedQueryResult<SavingsRateInfo>
  selectedTimeframe: SavingsRateTimeframe
  setSelectedTimeframe: (timeframe: Timeframe) => void
  availableTimeframes: SavingsRateTimeframe[]
}

export function useSavingsRateInfo({
  chainId,
  currentTimestamp,
  staleTime,
  savingsRateApiUrl,
}: UseSavingsRateInfoParams): UseSavingsRateInfoResult {
  const [selectedTimeframe, setSelectedTimeframe] = useState<SavingsRateTimeframe>('3M')

  const queryResult = useQuery({
    ...savingsRateQueryOptions({
      chainId,
      savingsRateApiUrl,
    }),
    select: useCallback(
      (savingsRateInfo: SavingsRateInfo) =>
        getFilteredSavingsRateData({ savingsRateInfo, timeframe: selectedTimeframe, currentTimestamp }),
      [selectedTimeframe, currentTimestamp],
    ),
    staleTime,
    enabled: !!savingsRateApiUrl,
  })

  return {
    queryResult,
    selectedTimeframe,
    setSelectedTimeframe: (selectedTimeframe) => {
      if (SAVINGS_RATE_TIMEFRAMES.includes(selectedTimeframe)) {
        setSelectedTimeframe(selectedTimeframe as any)
      }
    },
    availableTimeframes: SAVINGS_RATE_TIMEFRAMES,
  }
}
