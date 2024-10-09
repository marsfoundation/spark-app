import { useQuery } from '@tanstack/react-query'

import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { Timeframe } from '@/ui/charts/defaults'
import { SimplifiedQueryResult } from '@/utils/types'
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
  chartsSupported: boolean
}

export type MyEarningsInfo =
  | {
      data: MyEarningsInfoItem[]
      predictions: MyEarningsInfoItem[]
    }
  | undefined

export interface UseMyEarningsInfoResult {
  queryResult: SimplifiedQueryResult<MyEarningsInfo>
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
  chartsSupported,
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

  const queryResult = useQuery({
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
    enabled: chartsSupported && !!savingsInfo && !!savingsTokenWithBalance,
    staleTime,
  })

  const hasHistoricalData = (queryResult.data?.data?.length ?? 0) > 0
  const hasSavingTokenBalance = savingsTokenWithBalance?.balance.gt(0) ?? false

  return {
    queryResult,
    shouldDisplayMyEarnings: hasHistoricalData || hasSavingTokenBalance,
  }
}
