import { getChainConfigEntry } from '@/config/chain'
import { SuspenseQueryWith } from '@/utils/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { SavingsInfo } from './types'

export interface UseSavingsDaiInfoParams {
  chainId: number
}

export type UseSavingsDaiInfoResult = SuspenseQueryWith<{
  savingsDaiInfo: SavingsInfo | null
}>

export function useSavingsDaiInfo({ chainId }: UseSavingsDaiInfoParams): UseSavingsDaiInfoResult {
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()
  const queryOptions = getChainConfigEntry(chainId).savingsDaiInfoQuery

  const result = useSuspenseQuery(
    queryOptions
      ? queryOptions({ wagmiConfig, chainId, timestamp })
      : { queryKey: ['savings-dai-info-unavailable', chainId], queryFn: () => null },
  )

  return {
    ...result,
    savingsDaiInfo: result.data,
  }
}
