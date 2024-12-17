import { getChainConfigEntry } from '@/config/chain'
import { assert } from '@/utils/assert'
import { useTimestamp } from '@/utils/useTimestamp'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { useAccount, useChainId } from 'wagmi'
import { TokenWithBalance } from '../common/types'
import { SavingsInfo } from '../savings-info/types'
import { UseMyEarningsInfoResult, useMyEarningsInfo } from './useMyEarningsInfo/useMyEarningsInfo'
import { UseSavingsRateInfoResult, useSavingsRateInfo } from './useSavingsRateInfo/useSavingsRateInfo'

export type UseSavingsChartsInfoQueryResult = {
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
  const chainId = useChainId()

  const { address } = useAccount()
  const { timestamp } = useTimestamp({ refreshIntervalInMs: REFRESH_INTERVAL_IN_MS })

  const { savings } = getChainConfigEntry(chainId)

  assert(savings, 'Savings are not supported on this chain')

  const { getEarningsApiUrl, savingsRateApiUrl } = savings

  const myEarningsInfo = useMyEarningsInfo({
    address: address ? CheckedAddress(address) : undefined,
    chainId,
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
    currentTimestamp: timestamp,
    staleTime: REFRESH_INTERVAL_IN_MS,
    savingsRateApiUrl,
  })

  return {
    myEarningsInfo,
    savingsRateInfo,
    chartsSupported: !!savingsRateApiUrl || !!getEarningsApiUrl,
  }
}
