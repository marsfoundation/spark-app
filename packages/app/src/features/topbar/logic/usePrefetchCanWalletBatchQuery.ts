import { canWalletBatchQueryFn, canWalletBatchQueryKey } from '@/features/actions/logic/useCanWalletBatch'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useConfig } from 'wagmi'
import { watchAccount } from 'wagmi/actions'

export function usePrefetchCanWalletBatchQuery(): void {
  const config = useConfig()
  const queryClient = useQueryClient()

  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange({ address: account, chainId }) {
        void queryClient.prefetchQuery({
          queryKey: canWalletBatchQueryKey({ account, chainId }),
          queryFn: async () => await canWalletBatchQueryFn({ account, chainId, config }, { throwOnError: true }),
          initialData: { canWalletBatch: false },
          staleTime: 0,
        })
      },
    })
    return unwatch
  }, [config, queryClient])
}
