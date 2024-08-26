import { FarmConfig } from '@/domain/farms/types'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { getFarmInfo } from './getFarmInfo'

export interface FarmsInfoQueryOptionsParams {
  farms: FarmConfig[]
  wagmiConfig: Config
  tokensInfo: TokensInfo
  chainId: number
  account: Address | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function farmsInfoQueryOptions({
  farms,
  wagmiConfig,
  tokensInfo,
  chainId,
  account,
}: FarmsInfoQueryOptionsParams) {
  return queryOptions({
    queryKey: getFarmsInfoQueryKey({ account, chainId }),
    queryFn: async () => {
      return Promise.all(farms.map((farm) => getFarmInfo({ farm, wagmiConfig, tokensInfo, account })))
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
