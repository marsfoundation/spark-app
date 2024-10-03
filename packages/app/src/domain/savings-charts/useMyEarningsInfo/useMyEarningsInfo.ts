import { useQuery } from '@tanstack/react-query'

import { SavingsInfo } from '@/domain/savings-info/types'
import { Timeframe } from '@/ui/charts/defaults'
import { filterDataByTimeframe } from '@/ui/charts/utils'
import { assert } from '@/utils/assert'
import { Address } from 'viem'
import { calculatePredictions } from './calculate-predictions'
import { myEarningsInfoQueryKey, myEarningsQueryOptions } from './query'
import { MyEarningsInfoItem } from './types'

export interface UseMyEarningsInfoParams {
  address?: Address
  chainId: number
  timeframe: Timeframe
  currentTimestamp: number
  savingsInfo: SavingsInfo
}
export type UseMyEarningsInfoResult = {
  data:
    | {
        data: MyEarningsInfoItem[]
        predictions: MyEarningsInfoItem[]
      }
    | undefined
  isLoading: boolean
  isError: boolean
}

export function useMyEarningsInfo({
  address,
  chainId,
  timeframe,
  currentTimestamp,
  savingsInfo,
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

      const data = filterDataByTimeframe({
        data: myEarningsInfoData.data,
        timeframe,
        currentTimestamp,
      })

      const lastBalanceItem = data.at(-1)?.balance

      const predictions = lastBalanceItem
        ? calculatePredictions({
            savingsInfo,
            timeframe,
            timestamp: currentTimestamp,
            balance: lastBalanceItem,
          })
        : []

      return {
        data,
        predictions,
      }
    },
    enabled: !!myEarningsInfoData.data,
  })

  return {
    data: myEarningsInfoFiltered.data,
    isLoading: myEarningsInfoData.isLoading || myEarningsInfoFiltered.isLoading,
    isError: myEarningsInfoData.isError || myEarningsInfoFiltered.isError,
  }
}
