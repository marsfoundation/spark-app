import { TokenWithBalance } from '@/domain/common/types'
import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'

export function useFromTokenInfo(fromToken: TokenSymbol): TokenWithBalance {
  const chainConfig = useChainConfigEntry()
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens })
  return tokensInfo.findOneTokenWithBalanceBySymbol(fromToken)
}
