import { getChainConfigEntry } from '@/config/chain'
import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { CheckedAddress } from '../../types/CheckedAddress'
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
      const nativeAssetInfo = getNativeAssetInfo(chainId)

      const tokensWithBalances = await Promise.all(
        tokens.map(async (tokenConfig) => {
          const getOraclePrice = createOraclePriceFetcher({ tokenConfig, wagmiConfig })
          const getAssetData = createAssetDataFetcher({ tokenConfig, wagmiConfig, nativeAssetInfo, account })

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

      const featuredTokenSymbols = {
        DAI: chainConfig.daiSymbol,
        sDAI: chainConfig.sDaiSymbol,
        NST: chainConfig.NSTSymbol,
        sNST: chainConfig.sNSTSymbol,
      }

      return new TokensInfo(tokensWithBalances, featuredTokenSymbols)
    },
  })
}

export function tokensQueryKey({ tokens, account, chainId }: Omit<TokensParams, 'wagmiConfig'>): unknown[] {
  return [...getBalancesQueryKeyPrefix({ account, chainId }), 'tokens', tokens]
}
