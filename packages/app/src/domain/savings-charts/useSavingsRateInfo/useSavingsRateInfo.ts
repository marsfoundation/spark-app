import { SavingsRateQueryOptions } from '@/config/chain/types'
import { SimplifiedQueryResult } from '@/domain/common/query'
import { Timeframe } from '@/ui/charts/defaults'
import { filterDataByTimeframe } from '@/ui/charts/utils'
import { skipToken, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { SavingsRateChartData } from '../savings-rate-query/types'
import { SAVINGS_RATE_TIMEFRAMES, SavingsRateTimeframe } from './common'

export interface UseSavingsRateInfoParams {
  chainId: number
  currentTimestamp: number
  staleTime: number
  savingsRateQueryOptions: SavingsRateQueryOptions | undefined
}

export interface UseSavingsRateInfoResult {
  queryResult: SimplifiedQueryResult<SavingsRateChartData>
  selectedTimeframe: SavingsRateTimeframe
  setSelectedTimeframe: (timeframe: Timeframe) => void
  availableTimeframes: SavingsRateTimeframe[]
}

export function useSavingsRateInfo({
  currentTimestamp,
  staleTime,
  savingsRateQueryOptions,
}: UseSavingsRateInfoParams): UseSavingsRateInfoResult {
  const [selectedTimeframe, setSelectedTimeframe] = useState<SavingsRateTimeframe>('3M')

  const result = useQuery(
    savingsRateQueryOptions
      ? { ...savingsRateQueryOptions(), staleTime }
      : { queryKey: ['unsupported-savings-rate-query'], queryFn: skipToken },
  )

  const queryResult = useMemo(() => {
    if (!result.data) {
      return result
    }

    const filtered = filterDataByTimeframe({
      data: result.data.apy,
      timeframe: selectedTimeframe,
      currentTimestamp,
    })
    return {
      ...result,
      data: { apy: filtered },
    }
  }, [result, selectedTimeframe, currentTimestamp])

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
