import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { SuspenseQueryWith } from '@/utils/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { TokensInfo } from './TokenInfo'
import { tokensQueryOptions } from './query'
import { TokenConfig } from './types'

export interface UseTokensParams {
  tokens: TokenConfig[]
}

export type UseTokensResult = SuspenseQueryWith<{
  tokensInfo: TokensInfo
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
    tokensInfo: response.data,
  }
}
