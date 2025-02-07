import { MyEarningsQuery } from '@/config/chain/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { CheckedAddress, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useAccount, useChainId } from 'wagmi'
import { SavingsConverter } from '../savings-converters/types'
import { UseMyEarningsInfoResult, useMyEarningsInfo } from './useMyEarningsInfo/useMyEarningsInfo'
import { UseSavingsRateInfoResult, useSavingsRateInfo } from './useSavingsRateInfo/useSavingsRateInfo'

export type UseSavingsChartsDataResult = {
  myEarningsInfo: UseMyEarningsInfoResult
  savingsRateInfo: UseSavingsRateInfoResult
  chartsSupported: boolean
}

const REFRESH_INTERVAL_IN_MS = 60 * 60 * 1_000 // 1 hour

interface UseSavingsChartsDataParams {
  savingsConverter: SavingsConverter | null
  savingsTokenBalance: NormalizedUnitNumber | undefined
  myEarningsQuery: MyEarningsQuery | undefined
  savingsRateApiUrl: string | undefined
}

export function useSavingsChartsData({
  savingsConverter,
  savingsTokenBalance,
  myEarningsQuery,
  savingsRateApiUrl,
}: UseSavingsChartsDataParams): UseSavingsChartsDataResult {
  const chainId = useChainId()

  const { address } = useAccount()
  const { timestamp } = useTimestamp({ refreshIntervalInMs: REFRESH_INTERVAL_IN_MS })

  const myEarningsInfo = useMyEarningsInfo({
    address: address ? CheckedAddress(address) : undefined,
    currentTimestamp: timestamp,
    staleTime: REFRESH_INTERVAL_IN_MS,
    savingsConverter,
    savingsTokenBalance,
    myEarningsQuery,
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
    chartsSupported: !!savingsRateApiUrl || !!myEarningsQuery,
  }
}
