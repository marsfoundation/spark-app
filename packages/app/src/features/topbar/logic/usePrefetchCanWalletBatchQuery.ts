import { canWalletBatchQueryFn, canWalletBatchQueryKey } from '@/features/actions/logic/useCanWalletBatch'
import { useQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'

export function usePrefetchCanWalletBatchQuery(): void {
  const config = useConfig()
  const { address: account } = useAccount()
  const chainId = useChainId()
  useQuery({
    queryKey: canWalletBatchQueryKey({ account, chainId }),
    queryFn: async () => await canWalletBatchQueryFn({ account, chainId, config }, { throwOnError: true }),
    enabled: account !== undefined,
    initialData: { canWalletBatch: false },
    staleTime: 0,
  })
}
