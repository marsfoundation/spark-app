import { Timeframe } from '@/ui/charts/defaults'
import { useTimestamp } from '@/utils/useTimestamp'
import { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { UseMyEarningsInfoResult, useMyEarningsInfo } from './useMyEarningsInfo/useMyEarningsInfo'
import { UseSavingsRateInfoResult, useSavingsRateInfo } from './useSavingsRateInfo/useSavingsRateInfo'

export type UseSavingsChartsInfoQueryResult = {
  selectedTimeframe: Timeframe
  setSelectedTimeframe: (timeframe: Timeframe) => void
  myEarningsInfo: UseMyEarningsInfoResult
  savingsRateInfo: UseSavingsRateInfoResult
}

const STEP_IN_MS = 60 * 60 * 1_000 // 1 hour

export function useSavingsChartsInfoQuery(): UseSavingsChartsInfoQueryResult {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1M')
  const chainId = useChainId()

  const { address } = useAccount()
  const { timestamp } = useTimestamp({ refreshIntervalInMs: STEP_IN_MS })

  const myEarningsInfo = useMyEarningsInfo({
    address,
    chainId,
    timeframe: selectedTimeframe,
    currentTimestamp: timestamp,
  })

  const savingsRateInfo = useSavingsRateInfo({
    chainId,
    timeframe: selectedTimeframe,
    currentTimestamp: timestamp,
  })

  return {
    selectedTimeframe,
    setSelectedTimeframe,
    myEarningsInfo,
    savingsRateInfo,
  }
}
