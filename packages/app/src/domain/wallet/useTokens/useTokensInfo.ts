import { CheckedAddress } from '@marsfoundation/common-universal'
import { SuspenseQueryWith } from '@/utils/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { TokensInfo } from './TokenInfo'
import { tokensQueryOptions } from './query'
import { TokenConfig } from './types'

export interface UseTokensParams {
  tokens: TokenConfig[]
  chainId?: number
}

export type UseTokensResult = SuspenseQueryWith<{
  tokensInfo: TokensInfo
}>

export function useTokensInfo(params: UseTokensParams): UseTokensResult {
  const wagmiConfig = useConfig()
  const { address } = useAccount()
  const _chainId = useChainId()
  const { tokens, chainId = _chainId } = params

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
