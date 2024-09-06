import { TokenWithBalance } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { MarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'

export interface MergeMarketAndExtraTokensParams {
  marketInfo: MarketInfo
  walletInfo: MarketWalletInfo
  tokensInfo: TokensInfo
}

export function mergeMarketAndExtraTokens({
  marketInfo,
  tokensInfo,
  walletInfo,
}: MergeMarketAndExtraTokensParams): TokenWithBalance[] {
  const allSymbols = [...marketInfo.reserves.map((r) => r.token.symbol), ...tokensInfo.all().map((t) => t.token.symbol)]

  const res: TokenWithBalance[] = []
  for (const symbol of allSymbols) {
    if (res.some((r) => r.token.symbol === symbol)) {
      continue // deduplicate
    }

    const tokenWithBalance = (() => {
      const tokenFromMarket = marketInfo.findTokenBySymbol(symbol)
      if (tokenFromMarket) {
        return {
          token: tokenFromMarket,
          balance: walletInfo.findWalletBalanceForToken(tokenFromMarket),
        }
      }

      return tokensInfo.findOneTokenWithBalanceBySymbol(symbol)
    })()

    res.push(tokenWithBalance)
  }

  return res
}
