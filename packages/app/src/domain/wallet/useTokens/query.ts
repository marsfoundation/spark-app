import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { TokenWithBalance } from '../../common/types'
import { CheckedAddress } from '../../types/CheckedAddress'
import { Token } from '../../types/Token'
import { getBalancesQueryKeyPrefix } from '../getBalancesQueryKeyPrefix'
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
  return queryOptions<TokenWithBalance[]>({
    queryKey: tokensQueryKey({ tokens, account, chainId }),
    queryFn: async () => {
      const nativeAssetInfo = getNativeAssetInfo(chainId)

      return Promise.all(
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
    },
  })
}

export function tokensQueryKey({ tokens, account, chainId }: Omit<TokensParams, 'wagmiConfig'>): unknown[] {
  return [...getBalancesQueryKeyPrefix({ account, chainId }), 'tokens', tokens]
}
