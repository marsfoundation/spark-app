import { TokenWithBalance } from '@/domain/common/types'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'

export function sortByUsdValueWithUsdsPriority(tokens: TokenWithBalance[], tokensInfo: TokensInfo): TokenWithBalance[] {
  return tokens.sort((a, b) => {
    const usdValueComparison = b.token.toUSD(b.balance).comparedTo(a.token.toUSD(a.balance))
    if (usdValueComparison !== 0) return usdValueComparison
    // Prioritize token with USDS symbol
    if (tokensInfo.USDS) {
      if (a.token.symbol === tokensInfo.USDS.symbol) return -1
      if (b.token.symbol === tokensInfo.USDS.symbol) return 1
    }
    return 0
  })
}
