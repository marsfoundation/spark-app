import { SavingsConverter } from '@/domain/savings-converters/types'
import { Timeframe } from '@/ui/charts/defaults'
import { SimplifiedQueryResult } from '@/utils/types'
import { CheckedAddress, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { MY_EARNINGS_TIMEFRAMES, MyEarningsTimeframe } from './common'
import { getFilteredEarningsWithPredictions } from './getFilteredEarningsWithPredictions'
import { myEarningsQueryOptions } from './query'
import { MyEarningsInfoItem } from './types'

export interface UseMyEarningsInfoParams {
  address?: CheckedAddress
  chainId: number
  currentTimestamp: number
  staleTime: number
  savingsConverter: SavingsConverter | null
  savingsTokenBalance: NormalizedUnitNumber | undefined
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
  savingsConverter,
  savingsTokenBalance,
  getEarningsApiUrl,
}: UseMyEarningsInfoParams): UseMyEarningsInfoResult {
  const [selectedTimeframe, setSelectedTimeframe] = useState<MyEarningsTimeframe>('All')

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
          savingsConverter,
          savingsTokenBalance,
        }),
      [selectedTimeframe, currentTimestamp, savingsConverter, savingsTokenBalance],
    ),
    enabled: !!getEarningsApiUrl && !!savingsConverter && !!savingsTokenBalance,
    staleTime,
  })

  const hasHistoricalData = (queryResult.data?.data?.length ?? 0) > 0
  const hasSavingTokenBalance = savingsTokenBalance?.gt(0) ?? false

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
