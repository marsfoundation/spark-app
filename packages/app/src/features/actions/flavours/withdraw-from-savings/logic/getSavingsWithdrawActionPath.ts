import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { raise } from '@marsfoundation/common-universal'
import { arbitrum, base, gnosis } from 'viem/chains'

export interface GetSavingsWithdrawActionPathParams {
  token: Token
  savingsToken: Token
  tokensInfo: TokensInfo
  chainId: number
}

export type SavingsWithdrawActionPath =
  | 'susds-to-usds'
  | 'susds-to-usdc'
  | 'susdc-to-usdc'
  | 'sdai-to-dai'
  | 'sdai-to-usdc'
  | 'sdai-to-usds'
  | 'sdai-to-sexy-dai'
  | 'base-susds-to-usdc'
  | 'base-susds-to-usds'
  | 'base-susdc-to-usdc'
  | 'arbitrum-susds-to-usds'
  | 'arbitrum-susds-to-usdc'

export function getSavingsWithdrawActionPath({
  token,
  savingsToken,
  tokensInfo,
  chainId,
}: GetSavingsWithdrawActionPathParams): SavingsWithdrawActionPath {
  const dai = tokensInfo.DAI?.symbol
  const sdai = tokensInfo.sDAI?.symbol
  const usds = tokensInfo.USDS?.symbol
  const susds = tokensInfo.sUSDS?.symbol
  const usdc = TokenSymbol('USDC')
  const susdc = TokenSymbol('sUSDC')

  if (token.symbol === dai && savingsToken.symbol === sdai && chainId === gnosis.id) {
    return 'sdai-to-sexy-dai'
  }

  if (chainId === base.id) {
    if (token.symbol === usds && savingsToken.symbol === susds) {
      return 'base-susds-to-usds'
    }

    if (token.symbol === usdc && savingsToken.symbol === susds) {
      return 'base-susds-to-usdc'
    }

    if (token.symbol === usdc && savingsToken.symbol === susdc) {
      return 'base-susdc-to-usdc'
    }
  }

  if (chainId === arbitrum.id) {
    if (token.symbol === usds && savingsToken.symbol === susds) {
      return 'arbitrum-susds-to-usds'
    }

    if (token.symbol === usdc && savingsToken.symbol === susds) {
      return 'arbitrum-susds-to-usdc'
    }
  }

  if (token.symbol === usds && savingsToken.symbol === susds) {
    return 'susds-to-usds'
  }

  if (token.symbol === usdc && savingsToken.symbol === susds) {
    return 'susds-to-usdc'
  }

  if (token.symbol === dai && savingsToken.symbol === sdai) {
    return 'sdai-to-dai'
  }

  if (token.symbol === usdc && savingsToken.symbol === sdai) {
    return 'sdai-to-usdc'
  }

  if (token.symbol === usds && savingsToken.symbol === sdai) {
    return 'sdai-to-usds'
  }

  if (token.symbol === usdc && savingsToken.symbol === susdc) {
    return 'susdc-to-usdc'
  }

  raise('Savings action type not recognized')
}
