import { Timeframe } from '@/ui/charts/defaults'
import { filterDataByTimeframe } from '@/ui/charts/utils'
import { assert } from '@/utils/assert'
import { useQuery } from '@tanstack/react-query'
import { savingsRateInfoQueryKey, savingsRateQueryOptions } from './query'
import { SavingsRateInfo } from './types'

export interface UseSavingsRateInfoParams {
  chainId: number
  timeframe: Timeframe
  currentTimestamp: number
}
export type UseSavingsRateInfoResult = {
  data: SavingsRateInfo | undefined
  isLoading: boolean
  isError: boolean
}

export function useSavingsRateInfo({
  chainId,
  timeframe,
  currentTimestamp,
}: UseSavingsRateInfoParams): UseSavingsRateInfoResult {
  const savingsRateInfo = useQuery({
    ...savingsRateQueryOptions({
      chainId,
    }),
  })

  const savingsRateInfoFiltered = useQuery({
    queryKey: [...savingsRateInfoQueryKey({ chainId }), timeframe, currentTimestamp],
    queryFn: () => {
      const { data } = savingsRateInfo

      assert(data, 'Savings rate info should be loaded before filtering')

      const ssr = filterDataByTimeframe({
        data: data.ssr,
        timeframe,
        currentTimestamp,
      })

      const dsr = filterDataByTimeframe({
        data: data.dsr,
        timeframe,
        currentTimestamp,
      })

      return {
        ssr,
        dsr,
      }
    },
    enabled: !!savingsRateInfo.data,
  })

  return {
    data: savingsRateInfoFiltered.data,
    isLoading: savingsRateInfo.isLoading || savingsRateInfoFiltered.isLoading,
    isError: savingsRateInfo.isError || savingsRateInfoFiltered.isError,
  }
}
