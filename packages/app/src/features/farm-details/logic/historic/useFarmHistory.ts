import { getChainConfigEntry } from '@/config/chain'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Timeframe } from '@/ui/charts/defaults'
import { useFilterChartDataByTimeframe } from '@/ui/charts/logic/useFilterDataByTimeframe'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { farmHistoricDataQueryOptions } from './query'
import { FarmHistoryItem } from './types'

export interface UseFarmHistoryParams {
  chainId: number
  farmAddress: CheckedAddress
}

export type FarmHistoryQueryResult = UseQueryResult<FarmHistoryItem[]>

export interface UseFarmHistoryResult {
  farmHistory: FarmHistoryQueryResult
  onTimeframeChange: (timeframe: Timeframe) => void
  timeframe: Timeframe
}

export function useFarmHistory({ chainId, farmAddress }: UseFarmHistoryParams): UseFarmHistoryResult {
  const [timeframe, setTimeframe] = useState<Timeframe>('All')
  const filterDataByTimeframe = useFilterChartDataByTimeframe(timeframe)

  const farmConfig = getChainConfigEntry(chainId).farms.find((farm) => farm.address === farmAddress)
  const farmHistory = useQuery({
    ...farmHistoricDataQueryOptions({
      chainId,
      farmAddress,
      historyCutoff: farmConfig?.historyCutoff,
    }),
    select: filterDataByTimeframe,
  })

  return {
    farmHistory,
    onTimeframeChange: setTimeframe,
    timeframe,
  }
}
