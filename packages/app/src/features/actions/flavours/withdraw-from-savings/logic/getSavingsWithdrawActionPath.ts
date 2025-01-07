import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { raise } from '@marsfoundation/common-universal'
import { base, gnosis } from 'viem/chains'

export interface GetSavingsWithdrawActionPathParams {
  token: Token
  savingsToken: Token
  tokensInfo: TokensInfo
  chainId: number
}

export type SavingsWithdrawActionPath =
  | 'susds-to-usds'
  | 'susds-to-usdc'
  | 'sdai-to-dai'
  | 'sdai-to-usdc'
  | 'sdai-to-usds'
  | 'sdai-to-sexy-dai'
  | 'base-susds-to-usdc'
  | 'base-susds-to-usds'

export function getSavingsWithdrawActionPath({
  token,
  savingsToken,
  tokensInfo,
  chainId,
}: GetSavingsWithdrawActionPathParams): SavingsWithdrawActionPath {
  if (
    token.symbol === tokensInfo.DAI?.symbol &&
    savingsToken.symbol === tokensInfo.sDAI?.symbol &&
    chainId === gnosis.id
  ) {
    return 'sdai-to-sexy-dai'
  }

  if (chainId === base.id) {
    if (token.symbol === tokensInfo.USDS?.symbol && savingsToken.symbol === tokensInfo.sUSDS?.symbol) {
      return 'base-susds-to-usds'
    }

    if (token.symbol === TokenSymbol('USDC') && savingsToken.symbol === tokensInfo.sUSDS?.symbol) {
      return 'base-susds-to-usdc'
    }
  }

  if (token.symbol === tokensInfo.USDS?.symbol && savingsToken.symbol === tokensInfo.sUSDS?.symbol) {
    return 'susds-to-usds'
  }

  if (token.symbol === TokenSymbol('USDC') && savingsToken.symbol === tokensInfo.sUSDS?.symbol) {
    return 'susds-to-usdc'
  }

  if (token.symbol === tokensInfo.DAI?.symbol && savingsToken.symbol === tokensInfo.sDAI?.symbol) {
    return 'sdai-to-dai'
  }

  if (token.symbol === TokenSymbol('USDC') && savingsToken.symbol === tokensInfo.sDAI?.symbol) {
    return 'sdai-to-usdc'
  }

  if (token.symbol === tokensInfo.USDS?.symbol && savingsToken.symbol === tokensInfo.sDAI?.symbol) {
    return 'sdai-to-usds'
  }

  raise('Savings action type not recognized')
}
