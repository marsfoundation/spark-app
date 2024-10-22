import { getChainConfigEntry } from '@/config/chain'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Timeframe } from '@/ui/charts/defaults'
import { useFilterChartDataByTimeframe } from '@/ui/charts/logic/useFilterDataByTimeframe'
import { raise } from '@/utils/assert'
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

  const chainConfig = getChainConfigEntry(chainId)
  const farms = chainConfig.farms ?? raise('Farms config is not defined on this chain')

  const farmConfig = farms.find((farm) => farm.address === farmAddress)

  // @todo we should raise when apiUrls is missing but there is no config for Base yet
  const getFarmDetailsApiUrl = chainConfig.apiUrls?.getFarmDetailsApiUrl

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
