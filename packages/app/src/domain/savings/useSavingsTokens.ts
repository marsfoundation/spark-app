import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { useTokens } from '@/domain/wallet/useTokens/useTokens'
import { useChainId } from 'wagmi'

export interface UseSavingsTokensResult {
  inputTokensInfo: TokensInfo
  sDaiWithBalance: TokenWithBalance
  sNSTWithBalance?: TokenWithBalance
}

export function useSavingsTokens(): UseSavingsTokensResult {
  const chainId = useChainId()
  const chainConfig = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokens({ tokens: chainConfig.extraTokens })

  const inputTokensInfo = tokensInfo.filter(({ token }) => chainConfig.savingsInputTokens.includes(token.symbol))
  const sDaiWithBalance = tokensInfo.findOneTokenWithBalanceBySymbol(chainConfig.sDaiSymbol)
  const sNSTWithBalance = chainConfig.sNSTSymbol && tokensInfo.findOneTokenWithBalanceBySymbol(chainConfig.sNSTSymbol)

  return {
    inputTokensInfo,
    sDaiWithBalance,
    sNSTWithBalance,
  }
}
