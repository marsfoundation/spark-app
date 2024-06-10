import { psmActionsAbi } from '@/config/abis/psmActionsAbi'
import { queryOptions } from '@tanstack/react-query'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { CheckedAddress } from '../types/CheckedAddress'

export interface GemQueryKeyParams {
  psmActions: CheckedAddress
  chainId: number
}

export interface GemQueryOptionsParams extends GemQueryKeyParams {
  config: Config
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function gemQueryOptions({ psmActions, chainId, config }: GemQueryOptionsParams) {
  return queryOptions({
    queryKey: gemQueryKey({ psmActions, chainId }),
    queryFn: async () => {
      const gem = await readContract(config, {
        address: psmActions,
        abi: psmActionsAbi,
        functionName: 'gem',
      })

      return gem
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })
}

export function gemQueryKey({ psmActions, chainId }: GemQueryKeyParams): unknown[] {
  return ['gem', chainId, psmActions]
}
