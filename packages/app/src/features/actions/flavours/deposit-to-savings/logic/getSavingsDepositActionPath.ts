import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { raise } from '@marsfoundation/common-universal'
import { base, gnosis } from 'viem/chains'

export type SavingsDepositActionPath =
  | 'usds-to-susds'
  | 'dai-to-susds'
  | 'usdc-to-susds'
  | 'dai-to-sdai'
  | 'usdc-to-sdai'
  | 'usdc-to-susdc'
  | 'sexy-dai-to-sdai'
  | 'base-usds-to-susds'
  | 'base-usdc-to-susds'
  | 'base-usdc-to-susdc'

export interface GetSavingsActionPathParams {
  token: Token
  savingsToken: Token
  tokensInfo: TokensInfo
  chainId: number
}

export function getSavingsDepositActionPath({
  token,
  savingsToken,
  tokensInfo,
  chainId,
}: GetSavingsActionPathParams): SavingsDepositActionPath {
  if (
    token.symbol === tokensInfo.DAI?.symbol &&
    savingsToken.symbol === tokensInfo.sDAI?.symbol &&
    chainId === gnosis.id
  ) {
    return 'sexy-dai-to-sdai'
  }

  if (chainId === base.id) {
    if (token.symbol === tokensInfo.USDS?.symbol && savingsToken.symbol === tokensInfo.sUSDS?.symbol) {
      return 'base-usds-to-susds'
    }

    if (token.symbol === TokenSymbol('USDC') && savingsToken.symbol === tokensInfo.sUSDS?.symbol) {
      return 'base-usdc-to-susds'
    }
  }

  if (token.symbol === tokensInfo.USDS?.symbol && savingsToken.symbol === tokensInfo.sUSDS?.symbol) {
    return 'usds-to-susds'
  }

  if (token.symbol === tokensInfo.DAI?.symbol && savingsToken.symbol === tokensInfo.sUSDS?.symbol) {
    return 'dai-to-susds'
  }

  if (token.symbol === TokenSymbol('USDC') && savingsToken.symbol === tokensInfo.sUSDS?.symbol) {
    return 'usdc-to-susds'
  }

  if (token.symbol === tokensInfo.DAI?.symbol && savingsToken.symbol === tokensInfo.sDAI?.symbol) {
    return 'dai-to-sdai'
  }

  if (token.symbol === TokenSymbol('USDC') && savingsToken.symbol === tokensInfo.sDAI?.symbol) {
    return 'usdc-to-sdai'
  }

  if (token.symbol === TokenSymbol('USDC') && savingsToken.symbol === TokenSymbol('sUSDC')) {
    return 'usdc-to-susdc'
  }

  raise('Savings deposit action type not recognized')
}
