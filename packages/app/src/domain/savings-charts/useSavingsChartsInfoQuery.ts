import { getChainConfigEntry } from '@/config/chain'
import { Timeframe } from '@/ui/charts/defaults'
import { assert } from '@/utils/assert'
import { useTimestamp } from '@/utils/useTimestamp'
import { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { TokenWithBalance } from '../common/types'
import { SavingsInfo } from '../savings-info/types'
import { CheckedAddress } from '../types/CheckedAddress'
import { UseMyEarningsInfoResult, useMyEarningsInfo } from './useMyEarningsInfo/useMyEarningsInfo'
import { UseSavingsRateInfoResult, useSavingsRateInfo } from './useSavingsRateInfo/useSavingsRateInfo'

export type UseSavingsChartsInfoQueryResult = {
  selectedTimeframe: Timeframe
  setSelectedTimeframe: (timeframe: Timeframe) => void
  myEarningsInfo: UseMyEarningsInfoResult
  savingsRateInfo: UseSavingsRateInfoResult
  chartsSupported: boolean
}

const REFRESH_INTERVAL_IN_MS = 60 * 60 * 1_000 // 1 hour

interface UseSavingsChartsInfoParams {
  savingsUsdsInfo: SavingsInfo | null
  susdsWithBalance: TokenWithBalance | undefined
  savingsDaiInfo: SavingsInfo | null
  sdaiWithBalance: TokenWithBalance | undefined
}

export function useSavingsChartsInfoQuery({
  savingsDaiInfo,
  sdaiWithBalance,
  savingsUsdsInfo,
  susdsWithBalance,
}: UseSavingsChartsInfoParams): UseSavingsChartsInfoQueryResult {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('All')
  const chainId = useChainId()

  const { address } = useAccount()
  const { timestamp } = useTimestamp({ refreshIntervalInMs: REFRESH_INTERVAL_IN_MS })

  const { savings } = getChainConfigEntry(chainId)

  assert(savings, 'Savings are not supported on this chain')

  const { getEarningsApiUrl, savingsRateApiUrl } = savings

  const myEarningsInfo = useMyEarningsInfo({
    address: address ? CheckedAddress(address) : undefined,
    chainId,
    timeframe: selectedTimeframe,
    currentTimestamp: timestamp,
    staleTime: REFRESH_INTERVAL_IN_MS,
    savingsDaiInfo,
    sdaiWithBalance,
    savingsUsdsInfo,
    susdsWithBalance,
    getEarningsApiUrl,
  })

  const savingsRateInfo = useSavingsRateInfo({
    chainId,
    timeframe: selectedTimeframe,
    currentTimestamp: timestamp,
    staleTime: REFRESH_INTERVAL_IN_MS,
    savingsRateApiUrl,
  })

  return {
    selectedTimeframe,
    setSelectedTimeframe,
    myEarningsInfo,
    savingsRateInfo,
    chartsSupported: !!savingsRateApiUrl || !!getEarningsApiUrl,
  }
}
