import { getChainConfigEntry } from '@/config/chain'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { Token } from '../../types/Token'
import { getBalancesQueryKeyPrefix } from '../getBalancesQueryKeyPrefix'
import { TokensInfo } from './TokenInfo'
import { createAssetDataFetcher } from './createAssetDataFetcher'
import { createOraclePriceFetcher } from './createOraclePriceFetcher'
import { OracleType } from './types'

interface TokensParams {
  tokens: { address: CheckedAddress; oracleType: OracleType }[]
  wagmiConfig: Config
  chainId: number
  account?: Address
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function tokensQueryOptions({ tokens, wagmiConfig, chainId, account }: TokensParams) {
  return queryOptions<TokensInfo>({
    queryKey: tokensQueryKey({ tokens, account, chainId }),
    queryFn: async () => {
      const chainConfig = getChainConfigEntry(chainId)

      const tokensWithBalances = await Promise.all(
        tokens.map(async (tokenConfig) => {
          const getOraclePrice = createOraclePriceFetcher({ tokenConfig, wagmiConfig, chainId })
          const getAssetData = createAssetDataFetcher({ tokenConfig, wagmiConfig, chainId, account })

          const [assetData, oraclePrice] = await Promise.all([getAssetData(), getOraclePrice()])

          const token = new Token({
            name: assetData.name,
            decimals: assetData.decimals,
            address: tokenConfig.address,
            symbol: assetData.symbol,
            unitPriceUsd: oraclePrice.toFixed(),
          })

          return { token, balance: assetData.balance }
        }),
      )

      const featuredTokens = {
        DAI: chainConfig.daiSymbol,
        sDAI: chainConfig.sdaiSymbol,
        USDS: chainConfig.usdsSymbol,
        sUSDS: chainConfig.susdsSymbol,
      }

      return new TokensInfo(tokensWithBalances, featuredTokens)
    },
  })
}

export function tokensQueryKey({ tokens, account, chainId }: Omit<TokensParams, 'wagmiConfig'>): unknown[] {
  return [...getBalancesQueryKeyPrefix({ account, chainId }), 'tokens', tokens]
}
