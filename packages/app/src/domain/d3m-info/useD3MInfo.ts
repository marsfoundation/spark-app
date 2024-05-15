import { useSuspenseQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'

import { SuspenseQueryWith } from '@/utils/types'

import { D3MInfoQuery } from './D3MInfoQuery'
import { D3MInfo } from './types'

interface UseD3MInfoParams {
  chainId?: number
}

type UseD3MInfoResult = SuspenseQueryWith<{
  D3MInfo: D3MInfo | undefined
}>

export function useD3MInfo(params: UseD3MInfoParams = {}): UseD3MInfoResult {
  const currentChainId = useChainId()
  const chainId = params.chainId ?? currentChainId
  const wagmiConfig = useConfig()

  const result = useSuspenseQuery(D3MInfoQuery({ wagmiConfig, chainId }))

  return {
    ...result,
    D3MInfo: result.data ?? undefined,
  }
}
