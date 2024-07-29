import { useSuspenseQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'

import { getChainConfigEntry } from '@/config/chain'
import { SuspenseQueryWith } from '@/utils/types'
import { useTimestamp } from '@/utils/useTimestamp'

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
    queryOptions({
      wagmiConfig,
      chainId,
      timestamp,
    }),
  )

  return {
    ...result,
    savingsNstInfo: result.data,
  }
}
