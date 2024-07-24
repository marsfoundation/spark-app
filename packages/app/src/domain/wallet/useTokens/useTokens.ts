import { TokenWithBalance } from '@/domain/common/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { SuspenseQueryWith } from '@/utils/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { OracleType, tokensQueryOptions } from './query'

export interface UseTokensParams {
  tokens: { address: CheckedAddress; oracleType: OracleType }[]
}

export type UseTokensResult = SuspenseQueryWith<{
  tokens: TokenWithBalance[]
}>

export function useTokens({ tokens }: UseTokensParams): UseTokensResult {
  const wagmiConfig = useConfig()
  const { address } = useAccount()
  const chainId = useChainId()

  const response = useSuspenseQuery({
    ...tokensQueryOptions({
      tokens,
      wagmiConfig,
      account: address && CheckedAddress(address),
      chainId,
    }),
  })

  return {
    ...response,
    tokens: response.data,
  }
}
