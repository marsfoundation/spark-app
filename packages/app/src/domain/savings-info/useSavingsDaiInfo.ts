import { getChainConfigEntry } from '@/config/chain'
import { SuspenseQueryWith } from '@/utils/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'
import { SavingsInfo } from './types'

export type UseSavingsDaiInfoResult = SuspenseQueryWith<{
  savingsDaiInfo: SavingsInfo | null
}>

export function useSavingsDaiInfo(): UseSavingsDaiInfoResult {
  const chainId = useChainId()
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()
  const queryOptions = getChainConfigEntry(chainId).savingsDaiInfoQuery

  const result = useSuspenseQuery(
    queryOptions
      ? queryOptions({ wagmiConfig, chainId, timestamp })
      : { queryKey: ['savings-info-unsupported'], queryFn: () => null },
  )

  return {
    ...result,
    savingsDaiInfo: result.data,
  }
}
