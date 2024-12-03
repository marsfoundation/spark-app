import { getChainConfigEntry } from '@/config/chain'
import { Timeframe } from '@/ui/charts/defaults'
import { useFilterChartDataByTimeframe } from '@/ui/charts/logic/useFilterDataByTimeframe'
import { raise } from '@/utils/assert'
import { CheckedAddress } from '@marsfoundation/common-universal'
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

  const farmsConfig = getChainConfigEntry(chainId).farms ?? raise('Farms config is not defined on this chain')

  const farmConfig = farmsConfig.configs.find((farm) => farm.address === farmAddress)

  // @todo we should raise when getFarmDetailsApiUrl is missing but there is no apiUrl for Base yet
  const getFarmDetailsApiUrl = farmsConfig.getFarmDetailsApiUrl

  const farmHistory = useQuery({
    ...farmHistoricDataQueryOptions({
      chainId,
      farmAddress,
      historyCutoff: farmConfig?.historyCutoff,
      getFarmDetailsApiUrl,
    }),
    select: filterDataByTimeframe,
    enabled: !!getFarmDetailsApiUrl,
  })

  return {
    farmHistory,
    onTimeframeChange: setTimeframe,
    timeframe,
  }
}
