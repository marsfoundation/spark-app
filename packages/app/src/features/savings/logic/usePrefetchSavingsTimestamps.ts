import { savingsTimestampsQueryOptions } from '@/domain/savings/useSavingsTimestamps'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useConfig } from 'wagmi'

export interface UsePrefetchSavingsTimestampsParams {
  chainId: number
}

export function usePrefetchSavingsTimestamps({ chainId }: UsePrefetchSavingsTimestampsParams): void {
  const queryClient = useQueryClient()
  const wagmiConfig = useConfig()

  useEffect(() => {
    void queryClient.prefetchQuery(savingsTimestampsQueryOptions({ wagmiConfig, chainId }))
  }, [queryClient, wagmiConfig, chainId])
}
