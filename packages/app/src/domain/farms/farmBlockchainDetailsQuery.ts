import { FarmConfig } from '@/domain/farms/types'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { QueryKey, queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { getFarmBlockchainDetails } from './getFarmBlockchainDetails'

export interface FarmsBlockchainDetailsQueryOptionsParams {
  farmConfigs: FarmConfig[]
  wagmiConfig: Config
  tokensInfo: TokensInfo
  chainId: number
  account: Address | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function farmsBlockchainDetailsQueryOptions({
  farmConfigs,
  wagmiConfig,
  tokensInfo,
  chainId,
  account,
}: FarmsBlockchainDetailsQueryOptionsParams) {
  return queryOptions({
    queryKey: getFarmsBlockchainDetailsQueryKey({ account, chainId }),
    queryFn: async () => {
      return await Promise.all(
        farmConfigs.map((farmConfig) =>
          getFarmBlockchainDetails({ farmConfig, wagmiConfig, tokensInfo, chainId, account }),
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
