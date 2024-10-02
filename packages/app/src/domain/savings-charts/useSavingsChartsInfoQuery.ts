import { Timeframe } from '@/ui/charts/defaults'
import { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { UseMyEarningsInfoResult, useMyEarningsInfo } from './useMyEarningsInfo/useMyEarningsInfo'
import { useSavingsRateInfo, UseSavingsRateInfoResult } from './useSavingsRateInfo/useSavingsRateInfo'

export type UseSavingsChartsInfoQueryResult = {
  selectedTimeframe: Timeframe
  setSelectedTimeframe: (timeframe: Timeframe) => void
  myEarningsInfo: UseMyEarningsInfoResult
  savingsRateInfo: UseSavingsRateInfoResult
}

export function useSavingsChartsInfoQuery(): UseSavingsChartsInfoQueryResult {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('All')
  const chainId = useChainId()

  const { address } = useAccount()

  const myEarningsInfo = useMyEarningsInfo({
    address,
    chainId,
  })

  const savingsRateInfo = useSavingsRateInfo({
    chainId,
  })

  return {
    selectedTimeframe,
    setSelectedTimeframe,
    myEarningsInfo,
    savingsRateInfo
  }
}
