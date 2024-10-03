import { useQuery } from '@tanstack/react-query'

import { SavingsInfo } from '@/domain/savings-info/types'
import { Timeframe } from '@/ui/charts/defaults'
import { useCallback } from 'react'
import { Address } from 'viem'
import { getFilteredEarningsWithPredictions } from './getFilteredEarningsWithPredictions'
import { myEarningsQueryOptions } from './query'
import { MyEarningsInfoDataItem, MyEarningsInfoItem } from './types'

export interface UseMyEarningsInfoParams {
  address?: Address
  chainId: number
  timeframe: Timeframe
  currentTimestamp: number
  savingsInfo: SavingsInfo
  staleTime: number
  savingsType: 'susds' | 'sdai'
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
  savingsType,
}: UseMyEarningsInfoParams): UseMyEarningsInfoResult {
  const myEarningsInfoData = useQuery({
    ...myEarningsQueryOptions({
      address,
      chainId,
    }),
    select: useCallback(
      (myEarningsInfo: MyEarningsInfoDataItem[]) =>
        getFilteredEarningsWithPredictions({
          myEarningsInfo,
          timeframe,
          currentTimestamp,
          savingsInfo,
          savingsType,
        }),
      [timeframe, currentTimestamp, savingsInfo, savingsType],
    ),
    staleTime,
  })

  return {
    data: myEarningsInfoData.data,
    isLoading: myEarningsInfoData.isLoading,
    isError: myEarningsInfoData.isError,
  }
}
