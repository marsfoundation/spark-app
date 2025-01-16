import { SupportedChainId } from '@/config/chain/types'
import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { QueryKey, UseSuspenseQueryResult, queryOptions, skipToken, useSuspenseQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config, useAccount, useConfig } from 'wagmi'
import { getCapabilities } from 'wagmi/actions/experimental'

const CAPABILITIES_QUERY_FN_TIMEOUT = 3000

export function useCanWalletBatch(): UseSuspenseQueryResult<boolean> {
  const config = useConfig()
  const chainId = useOriginChainId()
  const { address: account } = useAccount()
  return useSuspenseQuery(canWalletBatchQueryOptions({ config, chainId, account }))
}

export interface CanWalletBatchQueryOptionsParams {
  account: Address | undefined
  chainId: SupportedChainId
  config: Config
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function canWalletBatchQueryOptions({ account, chainId, config }: CanWalletBatchQueryOptionsParams) {
  return queryOptions({
    queryKey: canWalletBatchQueryKey({ account, chainId }),
    queryFn: account
      ? async () => {
          try {
            const capabilities = await withTimeout(getCapabilities(config, { account }), CAPABILITIES_QUERY_FN_TIMEOUT)
            return capabilities[chainId]?.atomicBatch?.supported === true
          } catch {
            return false
          }
        }
      : skipToken,
  })
}

export interface CanWalletBatchQueryKeyParams {
  account: Address | undefined
  chainId: number
}

export function canWalletBatchQueryKey({ account, chainId }: CanWalletBatchQueryKeyParams): QueryKey {
  return ['can-wallet-batch', account, chainId]
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let rejectTimeout: ReturnType<typeof setTimeout>

  const rejectTimeoutPromise = new Promise<never>((_, reject) => {
    rejectTimeout = setTimeout(() => {
      reject(new Error(`Query timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  return Promise.race([
    promise.finally(() => {
      clearTimeout(rejectTimeout)
    }),
    rejectTimeoutPromise,
  ])
}
