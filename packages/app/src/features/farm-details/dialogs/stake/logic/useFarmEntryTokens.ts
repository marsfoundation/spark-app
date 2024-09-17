import { TokenWithBalance } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'

export interface UseFarmEntryTokensResult {
  tokensInfo: TokensInfo
  entryTokens: TokenWithBalance[]
}

export function useFarmEntryTokens(farm: Farm): UseFarmEntryTokensResult {
  const chainConfig = useChainConfigEntry()
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens })

  const entryTokensUnsorted = farm.entryAssetsGroup.assets.map((symbol) =>
    tokensInfo.findOneTokenWithBalanceBySymbol(symbol),
  )

  const entryTokens = entryTokensUnsorted.sort((a, b) => {
    const usdValueComparison = b.token.toUSD(b.balance).comparedTo(a.token.toUSD(a.balance))
    if (usdValueComparison !== 0) return usdValueComparison
    // Prioritize token with USDS symbol
    if (tokensInfo.USDS) {
      if (a.token.symbol === tokensInfo.USDS.symbol) return -1
      if (b.token.symbol === tokensInfo.USDS.symbol) return 1
    }
    return 0
  })

  return {
    tokensInfo,
    entryTokens,
  }
}
