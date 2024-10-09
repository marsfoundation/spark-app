import { getChainConfigEntry } from '@/config/chain'
import { SuspenseQueryWith } from '@/utils/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'
import { SavingsInfo } from './types'

export interface UseSavingsUsdsInfoParams {
  chainId?: number
}

export type UseSavingsUsdsInfoResult = SuspenseQueryWith<{
  savingsUsdsInfo: SavingsInfo | null
}>

export function useSavingsUsdsInfo(params: UseSavingsUsdsInfoParams = {}): UseSavingsUsdsInfoResult {
  const currentChainId = useChainId()
  const chainId = params.chainId ?? currentChainId
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()
  const queryOptions = getChainConfigEntry(chainId).savingsUsdsInfoQuery

  const result = useSuspenseQuery(
    queryOptions
      ? queryOptions({ wagmiConfig, chainId, timestamp })
      : { queryKey: ['savings-usds-info-unavailable', chainId], queryFn: () => null },
  )

  return {
    ...result,
    savingsUsdsInfo: result.data,
  }
}
