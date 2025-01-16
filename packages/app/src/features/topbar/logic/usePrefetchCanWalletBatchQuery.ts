import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { canWalletBatchQueryOptions } from '@/features/actions/logic/useCanWalletBatch'
import { useQueryClient } from '@tanstack/react-query'
import { useAccountEffect, useConfig } from 'wagmi'

export function usePrefetchCanWalletBatchQuery(): void {
  const queryClient = useQueryClient()
  const chainId = useOriginChainId()
  const config = useConfig()

  useAccountEffect({
    onConnect({ address: account }) {
      queryClient.prefetchQuery(canWalletBatchQueryOptions({ account, chainId, config }))
    },
  })
}
