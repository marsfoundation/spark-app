import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { useChainId } from 'wagmi'

export interface UseSavingsTokensResult {
  tokensInfo: TokensInfo
  inputTokens: TokenWithBalance[]
  sDaiWithBalance: TokenWithBalance
  sNSTWithBalance?: TokenWithBalance
}

export function useSavingsTokens(): UseSavingsTokensResult {
  const chainId = useChainId()
  const chainConfig = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens })

  const inputTokens = tokensInfo.filter(({ token }) => chainConfig.savingsInputTokens.includes(token.symbol))
  const sDaiWithBalance = tokensInfo.findOneTokenWithBalanceBySymbol(chainConfig.sDaiSymbol)
  const sNSTWithBalance = chainConfig.sNSTSymbol && tokensInfo.findOneTokenWithBalanceBySymbol(chainConfig.sNSTSymbol)

  return {
    tokensInfo,
    inputTokens,
    sDaiWithBalance,
    sNSTWithBalance,
  }
}
