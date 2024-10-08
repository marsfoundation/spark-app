import { useQuery } from '@tanstack/react-query'

import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { Timeframe } from '@/ui/charts/defaults'
import { useCallback } from 'react'
import { Address } from 'viem'
import { getFilteredEarningsWithPredictions } from './getFilteredEarningsWithPredictions'
import { getSavingsDisplayType } from './getSavingsDisplayType'
import { myEarningsQueryOptions } from './query'
import { selectMyEarningsSavingsDataByDisplayType } from './selectMyEarningsSavingsDataByDataType'
import { MyEarningsInfoItem } from './types'

export interface UseMyEarningsInfoParams {
  address?: Address
  chainId: number
  timeframe: Timeframe
  currentTimestamp: number
  staleTime: number
  savingsUsdsInfo: SavingsInfo | null
  sUSDSWithBalance: TokenWithBalance | undefined
  savingsDaiInfo: SavingsInfo | null
  sDaiWithBalance: TokenWithBalance | undefined
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
  shouldDisplayMyEarnings: boolean
}

export function useMyEarningsInfo({
  address,
  chainId,
  timeframe,
  currentTimestamp,
  staleTime,
  savingsUsdsInfo,
  sUSDSWithBalance,
  savingsDaiInfo,
  sDaiWithBalance,
}: UseMyEarningsInfoParams): UseMyEarningsInfoResult {
  const displayType = getSavingsDisplayType({
    savingsUsdsInfo,
    sUSDSWithBalance,
    savingsDaiInfo,
    sDaiWithBalance,
  })

  const { savingsInfo, savingsTokenWithBalance } = selectMyEarningsSavingsDataByDisplayType({
    savingsUsdsInfo,
    savingsDaiInfo,
    sDaiWithBalance,
    sUSDSWithBalance,
    displayType,
  })

  const { data, isLoading, isError } = useQuery({
    ...myEarningsQueryOptions({
      address,
      chainId,
    }),
    select: useCallback(
      (myEarningsInfo: MyEarningsInfoItem[]) =>
        getFilteredEarningsWithPredictions({
          myEarningsInfo,
          timeframe,
          currentTimestamp,
          savingsInfo,
          savingsTokenWithBalance,
        }),
      [timeframe, currentTimestamp, savingsInfo, savingsTokenWithBalance],
    ),
    enabled: !!savingsInfo && !!savingsTokenWithBalance,
    staleTime,
  })

  const hasHistoricalData = (data?.data?.length ?? 0) > 0
  const hasSavingTokenBalance = savingsTokenWithBalance?.balance.gt(0) ?? false

  return {
    data,
    isLoading,
    isError,
    shouldDisplayMyEarnings: hasHistoricalData || hasSavingTokenBalance,
  }
}
