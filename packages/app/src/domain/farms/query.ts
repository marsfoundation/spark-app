import { FarmConfig } from '@/domain/farms/types'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { FarmsInfo } from './farmsInfo'
import { getFarm } from './getFarm'

export interface FarmsInfoQueryOptionsParams {
  farmConfigs: FarmConfig[]
  wagmiConfig: Config
  tokensInfo: TokensInfo
  chainId: number
  account: Address | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function farmsInfoQueryOptions({
  farmConfigs,
  wagmiConfig,
  tokensInfo,
  chainId,
  account,
}: FarmsInfoQueryOptionsParams) {
  return queryOptions({
    queryKey: getFarmsInfoQueryKey({ account, chainId }),
    queryFn: async () => {
      const farms = await Promise.all(
        farmConfigs.map((farmConfig) => getFarm({ farmConfig, wagmiConfig, tokensInfo, account })),
      )
      return new FarmsInfo(farms)
    },
  })
}

export interface GetFarmsInfoQueryKeyParams {
  chainId: number
  account: Address | undefined
}

export function getFarmsInfoQueryKey({ account, chainId }: GetFarmsInfoQueryKeyParams): unknown[] {
  return ['farmsInfo', chainId, account]
}
