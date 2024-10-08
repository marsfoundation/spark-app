import { FarmConfig } from '@/domain/farms/types'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { QueryKey, queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { getFarmBlockchainInfo } from './getFarmBlockchainInfo'

export interface FarmsBlockchainInfoQueryOptionsParams {
  farmConfigs: FarmConfig[]
  wagmiConfig: Config
  tokensInfo: TokensInfo
  chainId: number
  account: Address | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function farmsBlockchainInfoQueryOptions({
  farmConfigs,
  wagmiConfig,
  tokensInfo,
  chainId,
  account,
}: FarmsBlockchainInfoQueryOptionsParams) {
  return queryOptions({
    queryKey: getFarmsBlockchainInfoQueryKey({ account, chainId }),
    queryFn: async () => {
      return await Promise.all(
        farmConfigs.map((farmConfig) =>
          getFarmBlockchainInfo({ farmConfig, wagmiConfig, tokensInfo, chainId, account }),
        ),
      )
    },
  })
}

export interface GetFarmsBlockchainInfoQueryKeyParams {
  chainId: number
  account: Address | undefined
}

export function getFarmsBlockchainInfoQueryKey({ account, chainId }: GetFarmsBlockchainInfoQueryKeyParams): QueryKey {
  return ['farmsBlockchainInfo', chainId, account]
}
