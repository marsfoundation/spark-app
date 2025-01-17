import { canWalletBatchQueryOptions } from '@/features/actions/logic/useCanWalletBatch'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'

export function usePrefetchCanWalletBatchQuery(): void {
  const queryClient = useQueryClient()
  const config = useConfig()
  const { address: account } = useAccount()
  const chainId = useChainId()

  if (account) {
    void queryClient.prefetchQuery(canWalletBatchQueryOptions({ account, chainId, config }))
  }
}
