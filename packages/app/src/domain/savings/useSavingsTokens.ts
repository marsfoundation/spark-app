import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { useChainId } from 'wagmi'

export interface UseSavingsTokensParams {
  chainId?: number
}

export interface UseSavingsTokensResult {
  tokensInfo: TokensInfo
  inputTokens: TokenWithBalance[]
  sDaiWithBalance: TokenWithBalance
  sUSDSWithBalance?: TokenWithBalance
}

export function useSavingsTokens(params: UseSavingsTokensParams = {}): UseSavingsTokensResult {
  const currentChainId = useChainId()
  const chainId = params.chainId ?? currentChainId
  const chainConfig = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens, chainId })

  const inputTokens = tokensInfo.filter(({ token }) => chainConfig.savingsInputTokens.includes(token.symbol))
  const sDaiWithBalance = tokensInfo.findOneTokenWithBalanceBySymbol(chainConfig.sDaiSymbol)
  const sUSDSWithBalance =
    chainConfig.sUSDSSymbol && tokensInfo.findOneTokenWithBalanceBySymbol(chainConfig.sUSDSSymbol)

  return {
    tokensInfo,
    inputTokens,
    sDaiWithBalance,
    sUSDSWithBalance,
  }
}
