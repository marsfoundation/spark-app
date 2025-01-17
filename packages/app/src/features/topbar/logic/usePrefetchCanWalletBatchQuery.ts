import { canWalletBatchQueryOptions } from '@/features/actions/logic/useCanWalletBatch'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAccount, useChainId, useConfig } from 'wagmi'

export function usePrefetchCanWalletBatchQuery(): void {
  const queryClient = useQueryClient()
  const config = useConfig()
  const { address: account } = useAccount()
  const chainId = useChainId()

  useEffect(() => {
    if (account) {
      void queryClient.prefetchQuery(canWalletBatchQueryOptions({ account, chainId, config }))
    }
  }, [account, chainId, config, queryClient])
}
