import { getChainConfigEntry } from '@/config/chain'
import { useTimestamp } from '@/utils/useTimestamp'
import { assert, CheckedAddress } from '@marsfoundation/common-universal'
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
  savingsInfo: SavingsInfo | null
  savingsTokenWithBalance: TokenWithBalance | undefined
}

export function useSavingsChartsInfoQuery({
  savingsInfo,
  savingsTokenWithBalance,
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
    savingsInfo,
    savingsTokenWithBalance,
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
