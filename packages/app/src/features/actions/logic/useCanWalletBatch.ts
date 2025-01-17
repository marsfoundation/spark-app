import { QueryKey, UseSuspenseQueryResult, queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config, useAccount, useChainId, useConfig } from 'wagmi'
import { getCapabilities } from 'wagmi/actions/experimental'

const CAPABILITIES_QUERY_FN_TIMEOUT = 3000

export function useCanWalletBatch(): UseSuspenseQueryResult<boolean> {
  const config = useConfig()
  const chainId = useChainId()
  const { address: account } = useAccount()
  return useSuspenseQuery(canWalletBatchQueryOptions({ config, chainId, account }))
}

export interface CanWalletBatchQueryOptionsParams {
  account: Address | undefined
  chainId: number
  config: Config
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function canWalletBatchQueryOptions({ account, chainId, config }: CanWalletBatchQueryOptionsParams) {
  return queryOptions({
    retry: false, // query is prefetched
    queryKey: canWalletBatchQueryKey({ account, chainId }),
    queryFn: async () => {
      if (!account) {
        return false
      }
      try {
        const capabilities = await withTimeout(getCapabilities(config, { account }), CAPABILITIES_QUERY_FN_TIMEOUT)
        return capabilities[chainId]?.atomicBatch?.supported === true
      } catch (e) {
        if (e instanceof CanBatchQueryTimeoutError) {
          console.error('Cannot check if wallet supports atomic batch transactions. Try reconnecting your wallet.', e)
        }
        return false
      }
    },
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
      reject(new CanBatchQueryTimeoutError(timeoutMs))
    }, timeoutMs)
  })

  return Promise.race([
    promise.finally(() => {
      clearTimeout(rejectTimeout)
    }),
    rejectTimeoutPromise,
  ])
}

export class CanBatchQueryTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Query timed out after ${timeoutMs}ms`)
    this.name = 'CanBatchQueryTimeoutError'
  }
}
