import { queryOptions } from '@tanstack/react-query'
import { erc4626Abi } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { CheckedAddress } from '../types/CheckedAddress'

export interface VaultAssetQueryKeyParams {
  vault: CheckedAddress
  chainId: number
}

export interface VaultAssetQueryOptionsParams extends VaultAssetQueryKeyParams {
  config: Config
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function vaultAssetQueryOptions({ vault, chainId, config }: VaultAssetQueryOptionsParams) {
  return queryOptions({
    queryKey: vaultAssetQueryKey({ vault, chainId }),
    queryFn: async () => {
      const asset = await readContract(config, {
        address: vault,
        abi: erc4626Abi,
        functionName: 'asset',
      })

      return asset
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })
}

export function vaultAssetQueryKey({ vault, chainId }: VaultAssetQueryKeyParams): unknown[] {
  return ['vault-asset', chainId, vault]
}
