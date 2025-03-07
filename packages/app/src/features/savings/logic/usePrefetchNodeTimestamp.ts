import { nodeTimestampQueryOptions } from '@/domain/time/useNodeTimestamp'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useConfig } from 'wagmi'
export interface UsePrefetchNodeTimestampParams {
  chainId: number
}

export function usePrefetchNodeTimestamp({ chainId }: UsePrefetchNodeTimestampParams): void {
  const queryClient = useQueryClient()
  const wagmiConfig = useConfig()

  useEffect(() => {
    void queryClient.prefetchQuery(nodeTimestampQueryOptions({ wagmiConfig, chainId }))
  }, [queryClient, wagmiConfig, chainId])
}
