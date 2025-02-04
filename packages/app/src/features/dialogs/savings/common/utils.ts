import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'

export function findUnderlyingToken(savingsToken: Token, tokensInfo: TokensInfo): Token | undefined {
  switch (savingsToken.symbol) {
    case tokensInfo.sDAI?.symbol:
      return tokensInfo.DAI
    case tokensInfo.sUSDS?.symbol:
      return tokensInfo.USDS
    case tokensInfo.findOneTokenBySymbol(TokenSymbol('sUSDC'))?.symbol:
      return tokensInfo.findOneTokenBySymbol(TokenSymbol('USDC'))
  }
}
