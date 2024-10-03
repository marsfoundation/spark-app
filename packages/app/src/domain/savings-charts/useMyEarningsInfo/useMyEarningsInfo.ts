import { useQuery } from '@tanstack/react-query'

import { Timeframe } from '@/ui/charts/defaults'
import { filterDataByTimeframe } from '@/ui/charts/utils'
import { assert } from '@/utils/assert'
import { Address } from 'viem'
import { myEarningsInfoQueryKey, myEarningsQueryOptions } from './query'
import { MyEarningsInfo } from './types'

export interface UseMyEarningsInfoParams {
  address?: Address
  chainId: number
  timeframe: Timeframe
  currentTimestamp: number
}
export type UseMyEarningsInfoResult = {
  data: MyEarningsInfo | undefined
  isLoading: boolean
  isError: boolean
}

export function useMyEarningsInfo({
  address,
  chainId,
  timeframe,
  currentTimestamp,
}: UseMyEarningsInfoParams): UseMyEarningsInfoResult {
  const myEarningsInfoData = useQuery({
    ...myEarningsQueryOptions({
      address,
      chainId,
    }),
  })

  const myEarningsInfoFiltered = useQuery({
    queryKey: [...myEarningsInfoQueryKey({ chainId, address }), timeframe, currentTimestamp],
    queryFn: () => {
      assert(myEarningsInfoData.data, 'My earnings info should be loaded before filtering')
      console.log('myEarningsInfoData', myEarningsInfoData.data)
      return filterDataByTimeframe({
        data: myEarningsInfoData.data,
        timeframe,
        currentTimestamp,
      })
    },
    enabled: !!myEarningsInfoData.data,
  })

  return {
    data: myEarningsInfoFiltered.data,
    isLoading: myEarningsInfoData.isLoading || myEarningsInfoFiltered.isLoading,
    isError: myEarningsInfoData.isError || myEarningsInfoFiltered.isError,
  }
}
