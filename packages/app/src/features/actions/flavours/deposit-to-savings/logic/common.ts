import { Token } from '@/domain/types/Token'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'

export function isDaiToSUsdsMigration({
  token,
  savingsToken,
  tokensInfo,
}: { token: Token; savingsToken: Token; tokensInfo: TokensInfo }): boolean {
  return token.symbol === tokensInfo.DAI?.symbol && savingsToken.symbol === tokensInfo.sUSDS?.symbol
}
