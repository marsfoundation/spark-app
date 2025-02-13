import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { TokenRepository } from '@/domain/token-repository/TokenRepository'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

export interface UseUpradeOptionsParams {
  chainId: number
  daiSymbol: TokenSymbol
  tokenRepository: TokenRepository
}
export interface UpgradeOptions {
  dai: TokenWithBalance
  usds: TokenWithBalance
}

export function useUpgradeOptions({
  chainId,
  daiSymbol,
  tokenRepository,
}: UseUpradeOptionsParams): UpgradeOptions | undefined {
  const chainConfig = getChainConfigEntry(chainId)

  if (!chainConfig.usdsSymbol) {
    return undefined
  }

  const usds = tokenRepository.findOneTokenWithBalanceBySymbol(chainConfig.usdsSymbol)
  const dai = tokenRepository.findOneTokenWithBalanceBySymbol(daiSymbol)

  return {
    dai,
    usds,
  }
}
