import { useQuery } from '@tanstack/react-query'

import { SavingsInfo } from '@/domain/savings-info/types'
import { Timeframe } from '@/ui/charts/defaults'
import { Address } from 'viem'
import { myEarningsQueryOptions, savingsRateFilteredQueryOptions } from './query'
import { MyEarningsInfoItem } from './types'

export interface UseMyEarningsInfoParams {
  address?: Address
  chainId: number
  timeframe: Timeframe
  currentTimestamp: number
  savingsInfo: SavingsInfo
  staleTime: number
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
  staleTime,
}: UseMyEarningsInfoParams): UseMyEarningsInfoResult {
  const myEarningsInfoData = useQuery({
    ...myEarningsQueryOptions({
      address,
      chainId,
      staleTime,
    }),
  })

  const myEarningsInfoFiltered = useQuery({
    ...savingsRateFilteredQueryOptions({
      chainId,
      timeframe,
      currentTimestamp,
      savingsInfo,
      myEarningsInfo: myEarningsInfoData.data,
      staleTime,
    }),
  })

  return {
    data: myEarningsInfoFiltered.data,
    isLoading: myEarningsInfoData.isLoading || myEarningsInfoFiltered.isLoading,
    isError: myEarningsInfoData.isError || myEarningsInfoFiltered.isError,
  }
}
