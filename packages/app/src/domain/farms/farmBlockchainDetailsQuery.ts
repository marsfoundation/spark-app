import { FarmConfig } from '@/config/chain/types'
import { TokenRepository } from '@/domain/token-repository/TokenRepository'
import { QueryKey, queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { getFarmBlockchainDetails } from './getFarmBlockchainDetails'

export interface FarmsBlockchainDetailsQueryOptionsParams {
  farmConfigs: FarmConfig[]
  wagmiConfig: Config
  tokenRepository: TokenRepository
  chainId: number
  account: Address | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function farmsBlockchainDetailsQueryOptions({
  farmConfigs,
  wagmiConfig,
  tokenRepository,
  chainId,
  account,
}: FarmsBlockchainDetailsQueryOptionsParams) {
  return queryOptions({
    queryKey: getFarmsBlockchainDetailsQueryKey({ account, chainId }),
    queryFn: async () => {
      return await Promise.all(
        farmConfigs.map((farmConfig) =>
          getFarmBlockchainDetails({ farmConfig, wagmiConfig, tokenRepository, chainId, account }),
        ),
      )
    },
  })
}

export interface GetFarmsBlockchainDetailsQueryKeyParams {
  chainId: number
  account: Address | undefined
}

export function getFarmsBlockchainDetailsQueryKey({
  account,
  chainId,
}: GetFarmsBlockchainDetailsQueryKeyParams): QueryKey {
  return ['farmsBlockchainInfo', chainId, account]
}
