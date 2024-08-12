import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { gnosis } from 'viem/chains'

export function isVaultOperation({
  token,
  savingsToken,
  tokensInfo,
  chainId,
}: { token: Token; savingsToken: Token; tokensInfo: TokensInfo; chainId: number }): boolean {
  if (isSexyDaiOperation({ token, savingsToken, tokensInfo, chainId })) {
    return false
  }

  return (
    (token.symbol === tokensInfo.DAI?.symbol && savingsToken.symbol === tokensInfo.sDAI?.symbol) ||
    (token.symbol === tokensInfo.NST?.symbol && savingsToken.symbol === tokensInfo.sNST?.symbol)
  )
}

export function isSexyDaiOperation({
  token,
  savingsToken,
  tokensInfo,
  chainId,
}: { token: Token; savingsToken: Token; tokensInfo: TokensInfo; chainId: number }): boolean {
  return (
    token.symbol === tokensInfo.DAI?.symbol && savingsToken.symbol === tokensInfo.sDAI?.symbol && chainId === gnosis.id
  )
}

export function isUsdcPsmActionsOperation({
  token,
  savingsToken,
  tokensInfo,
}: { token: Token; savingsToken: Token; tokensInfo: TokensInfo }): boolean {
  return token.symbol === TokenSymbol('USDC') && savingsToken.symbol === tokensInfo.sDAI?.symbol
}
