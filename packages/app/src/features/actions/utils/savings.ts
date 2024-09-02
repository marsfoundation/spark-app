import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import BigNumber from 'bignumber.js'
import { gnosis } from 'viem/chains'

export function calculateGemConversionFactor({
  gemDecimals,
  assetsTokenDecimals,
}: { gemDecimals: number; assetsTokenDecimals: number }): BigNumber {
  return BigNumber(10).pow(assetsTokenDecimals - gemDecimals)
}

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
    (token.symbol === tokensInfo.USDS?.symbol && savingsToken.symbol === tokensInfo.sUSDS?.symbol)
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

export function isSDaiToUsdsWithdraw({
  token,
  savingsToken,
  tokensInfo,
}: { token: Token; savingsToken: Token; tokensInfo: TokensInfo }): boolean {
  return token.symbol === tokensInfo.USDS?.symbol && savingsToken.symbol === tokensInfo.sDAI?.symbol
}
