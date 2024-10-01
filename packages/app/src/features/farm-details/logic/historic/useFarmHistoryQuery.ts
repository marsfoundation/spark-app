import { getChainConfigEntry } from '@/config/chain'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { farmHistoricDataQueryOptions } from './query'
import { FarmHistoryItem } from './types'

export interface UseFarmHistoryQueryParams {
  chainId: number
  farmAddress: CheckedAddress
}

export type FarmHistoryQueryResult = UseQueryResult<FarmHistoryItem[]>

export function useFarmHistoryQuery({ chainId, farmAddress }: UseFarmHistoryQueryParams): FarmHistoryQueryResult {
  const farmConfig = getChainConfigEntry(chainId).farms.find((farm) => farm.address === farmAddress)
  return useQuery(farmHistoricDataQueryOptions({ chainId, farmAddress, historyCutoff: farmConfig?.historyCutoff }))
}
