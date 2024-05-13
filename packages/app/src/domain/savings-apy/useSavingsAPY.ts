import { useSuspenseQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'

import { getChainConfigEntry } from '@/config/chain'
import { SuspenseQueryWith } from '@/utils/types'

import { Percentage } from '../types/NumericValues'

interface UseSavingsAPYParams {
  chainId?: number
}

type UseSavingsAPYResult = SuspenseQueryWith<{
  apy: Percentage
}>

export function useSavingsAPY(params: UseSavingsAPYParams = {}): UseSavingsAPYResult {
  const currentChainId = useChainId()
  const chainId = params.chainId ?? currentChainId
  const wagmiConfig = useConfig()
  const queryOptions = getChainConfigEntry(chainId).savingsAPYQueryOptionsFactory

  const result = useSuspenseQuery(queryOptions({ wagmiConfig }))

  return {
    ...result,
    apy: result.data,
  }
}
