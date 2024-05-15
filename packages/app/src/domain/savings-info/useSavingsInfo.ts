import { useSuspenseQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'

import { getChainConfigEntry } from '@/config/chain'
import { SuspenseQueryWith } from '@/utils/types'
import { useTimestamp } from '@/utils/useTimestamp'

import { useOriginChainId } from '../hooks/useOriginChainId'
import { SavingsInfo } from './types'

export type UseSavingsInfoResult = SuspenseQueryWith<{
  savingsInfo: SavingsInfo | null
}>

export function useSavingsInfo(): UseSavingsInfoResult {
  const chainId = useOriginChainId()
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()

  const queryOptions = getChainConfigEntry(chainId).savingsInfoQuery
  const result = useSuspenseQuery(
    queryOptions({
      wagmiConfig,
      chainId,
      timestamp,
    }),
  )

  return {
    ...result,
    savingsInfo: result.data,
  }
}
