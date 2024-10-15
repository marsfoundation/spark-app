import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'

export interface UseUpradeOptionsParams {
  chainId: number
  daiSymbol: TokenSymbol
}
export interface UpgradeOptions {
  dai: TokenWithBalance
  usds: TokenWithBalance
}

export function useUpgradeOptions({ chainId, daiSymbol }: UseUpradeOptionsParams): UpgradeOptions | undefined {
  const chainConfig = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens, chainId })

  if (!chainConfig.usdsSymbol) {
    return undefined
  }

  const usds = tokensInfo.findOneTokenWithBalanceBySymbol(chainConfig.usdsSymbol)
  const dai = tokensInfo.findOneTokenWithBalanceBySymbol(daiSymbol)

  return {
    dai,
    usds,
  }
}
