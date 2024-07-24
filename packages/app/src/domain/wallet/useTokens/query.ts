import { queryOptions } from '@tanstack/react-query'
import { Address, erc20Abi } from 'viem'
import { Config } from 'wagmi'
import { multicall } from 'wagmi/actions'
import { TokenWithBalance } from '../../common/types'
import { CheckedAddress } from '../../types/CheckedAddress'
import { NormalizedUnitNumber } from '../../types/NumericValues'
import { Token } from '../../types/Token'
import { TokenSymbol } from '../../types/TokenSymbol'

export type OracleType = 'fixed-usd' | 'pot-dai'

interface TokensParams {
  tokens: { address: CheckedAddress; oracleType: OracleType }[]
  wagmiConfig: Config
  chainId: number
  account?: Address
}

const TOKEN_CALLS = [
  { functionName: 'balanceOf', args: (account: Address) => [account] },
  { functionName: 'decimals', args: () => [] },
  { functionName: 'symbol', args: () => [] },
  { functionName: 'name', args: () => [] },
] as const

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function tokensQueryOptions({ tokens, wagmiConfig, chainId, account }: TokensParams) {
  return queryOptions<TokenWithBalance[]>({
    queryKey: tokensQueryKey({ tokens, account, chainId }),
    queryFn: !account
      ? () => []
      : async () => {
          const data = await multicall(wagmiConfig, {
            allowFailure: false,
            chainId,
            contracts: [
              // fetch pot related info to get the price
              ...tokens.flatMap((token) =>
                TOKEN_CALLS.map((call) => ({
                  address: token.address,
                  functionName: call.functionName,
                  args: call.args(account),
                  abi: erc20Abi,
                })),
              ),
            ],
          })

          return tokens.map((token, index) => {
            const startIndex = index * TOKEN_CALLS.length
            const [balance, decimals, symbol, name] = TOKEN_CALLS.map((_, i) => data[startIndex + i])

            return {
              token: new Token({
                address: token.address,
                decimals: decimals as number,
                symbol: TokenSymbol(symbol as string),
                name: name as string,
                unitPriceUsd: '1',
              }),
              balance: NormalizedUnitNumber(balance as bigint),
            }
          })
        },
  })
}

export function tokensQueryKey({ tokens, account, chainId }: Omit<TokensParams, 'wagmiConfig'>): unknown[] {
  return ['tokens', tokens, account, chainId]
}
