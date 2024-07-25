import { queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { TokenWithBalance } from '../../common/types'
import { CheckedAddress } from '../../types/CheckedAddress'
import { Token } from '../../types/Token'
import { createOraclePriceFetcher } from './createOraclePriceFetcher'
import { getERC20Data } from './getERC20Data'
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
    queryFn: !account
      ? () => []
      : async () => {
          return Promise.all(
            tokens.map(async (tokenConfig) => {
              const getOraclePrice = createOraclePriceFetcher({ tokenConfig, wagmiConfig })

              const [erc20Data, oraclePrice] = await Promise.all([
                getERC20Data({ tokenConfig, wagmiConfig, account }),
                getOraclePrice(),
              ])

              const token = new Token({
                name: erc20Data.name,
                decimals: erc20Data.decimals,
                address: tokenConfig.address,
                symbol: erc20Data.symbol,
                unitPriceUsd: oraclePrice.toFixed(),
              })

              return { token, balance: erc20Data.balance }
            }),
          )
        },
  })
}

export function tokensQueryKey({ tokens, account, chainId }: Omit<TokensParams, 'wagmiConfig'>): unknown[] {
  return ['tokens', tokens, account, chainId]
}
