import { promiseWithTimeout } from '@/utils/promiseWithTimeout'
import { QueryKey, UseSuspenseQueryResult, useSuspenseQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config, useAccount, useChainId, useConfig } from 'wagmi'
import { getCapabilities } from 'wagmi/actions/experimental'

const CAPABILITIES_QUERY_FN_TIMEOUT = 3000

export interface CanWalletBatchResult {
  canWalletBatch: boolean
}

export function useCanWalletBatch(): UseSuspenseQueryResult<CanWalletBatchResult> {
  const config = useConfig()
  const chainId = useChainId()
  const { address: account } = useAccount()
  return useSuspenseQuery({
    queryKey: canWalletBatchQueryKey({ account, chainId }),
    queryFn: async () =>
      await canWalletBatchQueryFn(
        { account, chainId, config },
        { throwOnError: false, fallbackValue: { canWalletBatch: false } }, // results in no refetching
      ),
  })
}

export interface CanWalletBatchQueryKeyParams {
  account: Address | undefined
  chainId: number
}

export function canWalletBatchQueryKey({ account, chainId }: CanWalletBatchQueryKeyParams): QueryKey {
  return ['can-wallet-batch', account, chainId]
}

interface CanWalletBatchQueryFnParams {
  account: Address | undefined
  chainId: number
  config: Config
}
type CanWalletBatchQueryFnOptions =
  | {
      throwOnError: false
      fallbackValue: CanWalletBatchResult
    }
  | {
      throwOnError: true
    }

export async function canWalletBatchQueryFn(
  { account, chainId, config }: CanWalletBatchQueryFnParams,
  options: CanWalletBatchQueryFnOptions,
): Promise<CanWalletBatchResult> {
  try {
    const capabilities = await promiseWithTimeout(getCapabilities(config, { account }), CAPABILITIES_QUERY_FN_TIMEOUT)
    return { canWalletBatch: capabilities[chainId]?.atomicBatch?.supported === true }
  } catch (e) {
    if (options.throwOnError) {
      throw e
    }
    return options.fallbackValue
  }
}
