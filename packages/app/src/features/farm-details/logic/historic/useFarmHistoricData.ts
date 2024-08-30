import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { SuspenseQueryWith } from '@/utils/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { farmHistoricDataQueryOptions } from './query'
import { FarmHistoryItem } from './types'

export interface UseFarmHistoricDataParams {
  chainId: number
  farmAddress: CheckedAddress
}

export type UseFarmHistoricDataResultOnSuccess = SuspenseQueryWith<{
  farmHistoricData: FarmHistoryItem[]
}>

export function useFarmHistoricData({
  chainId,
  farmAddress,
}: UseFarmHistoricDataParams): UseFarmHistoricDataResultOnSuccess {
  const res = useSuspenseQuery(farmHistoricDataQueryOptions({ chainId, farmAddress }))

  return {
    ...res,
    farmHistoricData: res.data,
  }
}
