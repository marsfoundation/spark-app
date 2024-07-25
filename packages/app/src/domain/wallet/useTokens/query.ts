import { getOracleContractCalls, getTokenUnitPriceUsd } from '@/domain/types/Oracle'
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
            contracts: tokens.flatMap(
              (token) => [
                ...TOKEN_CALLS.map((call) => ({
                  address: token.address,
                  functionName: call.functionName,
                  args: call.args(account),
                  abi: erc20Abi,
                })),
                ...getOracleContractCalls(token.oracleType, token.address),
              ],
              // fetch oracle related info to get the price
            ),
          })

          let startIndex = 0

          return tokens.map((token) => {
            const oracleCallsLength = getOracleContractCalls(token.oracleType, token.address).length

            const [balance, decimals, symbol, name, ...oracleData] = [
              ...TOKEN_CALLS.map((_, i) => data[startIndex + i]),
              ...Array.from({ length: oracleCallsLength }, (_, i) => data[startIndex + TOKEN_CALLS.length + i]),
            ]

            startIndex += TOKEN_CALLS.length + oracleCallsLength

            return {
              token: new Token({
                address: token.address,
                decimals: decimals as number,
                symbol: TokenSymbol(symbol as string),
                name: name as string,
                unitPriceUsd: getTokenUnitPriceUsd(token.oracleType, oracleData as unknown[]),
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
