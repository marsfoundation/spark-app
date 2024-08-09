import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { gnosis } from 'viem/chains'

export function isERC4626Deposit({
  config,
  tokensInfo,
  chainId,
}: { config: DepositToSavingsConfig; tokensInfo: TokensInfo; chainId: number }): boolean {
  const { token, savingsToken } = config
  if (isSexyDaiDeposit({ config, tokensInfo, chainId })) {
    return false
  }

  return (
    (token.symbol === tokensInfo.DAI?.symbol && savingsToken.symbol === tokensInfo.sDAI?.symbol) ||
    (token.symbol === tokensInfo.NST?.symbol && savingsToken.symbol === tokensInfo.sNST?.symbol)
  )
}

export function isSexyDaiDeposit({
  config,
  tokensInfo,
  chainId,
}: { config: DepositToSavingsConfig; tokensInfo: TokensInfo; chainId: number }): boolean {
  const { token, savingsToken } = config
  return (
    token.symbol === tokensInfo.DAI?.symbol && savingsToken.symbol === tokensInfo.sDAI?.symbol && chainId === gnosis.id
  )
}

export function isUSDCToSDaiDeposit({
  config,
  tokensInfo,
}: { config: DepositToSavingsConfig; tokensInfo: TokensInfo }): boolean {
  const { token, savingsToken } = config
  return token.symbol === TokenSymbol('USDC') && savingsToken.symbol === tokensInfo.sDAI?.symbol
}

export function isDaiToSNstMigration({
  config,
  tokensInfo,
}: { config: DepositToSavingsConfig; tokensInfo: TokensInfo }): boolean {
  const { token, savingsToken } = config
  return token.symbol === tokensInfo.DAI?.symbol && savingsToken.symbol === tokensInfo.sNST?.symbol
}

interface DepositToSavingsConfig {
  token: Token
  savingsToken: Token
}
