import { useQuery } from '@tanstack/react-query'

import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { Timeframe } from '@/ui/charts/defaults'
import { SimplifiedQueryResult } from '@/utils/types'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { useCallback, useState } from 'react'
import { MY_EARNINGS_TIMEFRAMES, MyEarningsTimeframe } from './common'
import { getFilteredEarningsWithPredictions } from './getFilteredEarningsWithPredictions'
import { getSavingsDisplayType } from './getSavingsDisplayType'
import { myEarningsQueryOptions } from './query'
import { selectMyEarningsSavingsDataByDisplayType } from './selectMyEarningsSavingsDataByDataType'
import { MyEarningsInfoItem } from './types'

export interface UseMyEarningsInfoParams {
  address?: CheckedAddress
  chainId: number
  timeframe: Timeframe
  currentTimestamp: number
  staleTime: number
  savingsUsdsInfo: SavingsInfo | null
  susdsWithBalance: TokenWithBalance | undefined
  savingsDaiInfo: SavingsInfo | null
  sdaiWithBalance: TokenWithBalance | undefined
  getEarningsApiUrl: ((address: CheckedAddress) => string) | undefined
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
  selectedTimeframe: MyEarningsTimeframe
  setSelectedTimeframe: (timeframe: Timeframe) => void
  availableTimeframes: MyEarningsTimeframe[]
}

export function useMyEarningsInfo({
  address,
  chainId,
  currentTimestamp,
  staleTime,
  savingsUsdsInfo,
  susdsWithBalance,
  savingsDaiInfo,
  sdaiWithBalance,
  getEarningsApiUrl,
}: UseMyEarningsInfoParams): UseMyEarningsInfoResult {
  const [selectedTimeframe, setSelectedTimeframe] = useState<MyEarningsTimeframe>('All')

  const displayType = getSavingsDisplayType({
    savingsUsdsInfo,
    susdsWithBalance,
    savingsDaiInfo,
    sdaiWithBalance,
  })

  const { savingsInfo, savingsTokenWithBalance } = selectMyEarningsSavingsDataByDisplayType({
    savingsUsdsInfo,
    savingsDaiInfo,
    sdaiWithBalance,
    susdsWithBalance,
    displayType,
  })

  const queryResult = useQuery({
    ...myEarningsQueryOptions({
      address,
      chainId,
      getEarningsApiUrl,
    }),
    select: useCallback(
      (myEarningsInfo: MyEarningsInfoItem[]) =>
        getFilteredEarningsWithPredictions({
          myEarningsInfo,
          timeframe: selectedTimeframe,
          currentTimestamp,
          savingsInfo,
          savingsTokenWithBalance,
        }),
      [selectedTimeframe, currentTimestamp, savingsInfo, savingsTokenWithBalance],
    ),
    enabled: !!getEarningsApiUrl && !!savingsInfo && !!savingsTokenWithBalance,
    staleTime,
  })

  const hasHistoricalData = (queryResult.data?.data?.length ?? 0) > 0
  const hasSavingTokenBalance = savingsTokenWithBalance?.balance.gt(0) ?? false

  return {
    queryResult,
    shouldDisplayMyEarnings: hasHistoricalData || hasSavingTokenBalance,
    selectedTimeframe,
    setSelectedTimeframe: (selectedTimeframe) => {
      if (MY_EARNINGS_TIMEFRAMES.includes(selectedTimeframe)) {
        setSelectedTimeframe(selectedTimeframe as any)
      }
    },
    availableTimeframes: MY_EARNINGS_TIMEFRAMES,
  }
}
