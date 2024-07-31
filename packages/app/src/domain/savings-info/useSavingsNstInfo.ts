import { getChainConfigEntry } from '@/config/chain'
import { SuspenseQueryWith } from '@/utils/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'
import { SavingsInfo } from './types'

export type UseSavingsNstInfoResult = SuspenseQueryWith<{
  savingsNstInfo: SavingsInfo | null
}>

export function useSavingsNstInfo(): UseSavingsNstInfoResult {
  const chainId = useChainId()
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()
  const queryOptions = getChainConfigEntry(chainId).savingsNstInfoQuery

  const result = useSuspenseQuery(
    queryOptions
      ? queryOptions({ wagmiConfig, chainId, timestamp })
      : { queryKey: ['savings-nst-info-unavailable', chainId], queryFn: () => null },
  )

  return {
    ...result,
    savingsNstInfo: result.data,
  }
}
