import { getChainConfigEntry } from '@/config/chain'
import { TokenConfig } from '@/config/chain/types'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { TokenRepository } from './TokenRepository'
import { tokenDataQueryOptions } from './tokenDataQuery'

export interface UseTokenRepositoryParams {
  tokenConfigs: TokenConfig[]
  chainId?: number
}

export interface UseTokenRepositoryResult {
  tokenRepository: TokenRepository
}

export function useTokenRepository(params: UseTokenRepositoryParams): UseTokenRepositoryResult {
  const wagmiConfig = useConfig()
  const { address } = useAccount()
  const _chainId = useChainId()
  const { tokenConfigs, chainId = _chainId } = params
  const chainConfig = getChainConfigEntry(chainId)

  const response = useSuspenseQueries({
    queries: tokenConfigs.map((tokenConfig) =>
      tokenDataQueryOptions({ tokenConfig, wagmiConfig, chainId, account: address }),
    ),
  })

  const featuredTokens = {
    DAI: chainConfig.daiSymbol,
    sDAI: chainConfig.sdaiSymbol,
    USDS: chainConfig.usdsSymbol,
    sUSDS: chainConfig.susdsSymbol,
  }
  const tokenRepository = new TokenRepository(
    response.map((r) => r.data),
    featuredTokens,
  )

  return {
    tokenRepository,
  }
}
