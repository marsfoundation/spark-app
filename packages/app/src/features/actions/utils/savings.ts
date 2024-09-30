import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import BigNumber from 'bignumber.js'
import { gnosis } from 'viem/chains'
import { raise } from '@/utils/assert.ts'

export function calculateGemConversionFactor({
  gemDecimals,
  assetsTokenDecimals,
}: { gemDecimals: number; assetsTokenDecimals: number }): BigNumber {
  return BigNumber(10).pow(assetsTokenDecimals - gemDecimals)
}

export type SavingsActionType =
  | 'usds-to-susds'
  | 'dai-to-susds'
  | 'usdc-to-susds'
  | 'dai-to-sdai'
  | 'usdc-to-sdai'
  | 'sexy-dai-to-sdai'

export function getSavingsActionType(opts: {
  token: Token
  savingsToken: Token
  tokensInfo: TokensInfo
  chainId: number
}): SavingsActionType {
  if (
    opts.token.symbol === opts.tokensInfo.DAI?.symbol &&
    opts.savingsToken.symbol === opts.tokensInfo.sDAI?.symbol &&
    opts.chainId === gnosis.id
  ) {
    return 'sexy-dai-to-sdai'
  }

  if (
    opts.token.symbol === opts.tokensInfo.USDS?.symbol &&
    opts.savingsToken.symbol === opts.tokensInfo.sUSDS?.symbol
  ) {
    return 'usds-to-susds'
  }

  if (opts.token.symbol === opts.tokensInfo.DAI?.symbol && opts.savingsToken.symbol === opts.tokensInfo.sUSDS?.symbol) {
    return 'dai-to-susds'
  }

  if (opts.token.symbol === TokenSymbol('USDC') && opts.savingsToken.symbol === opts.tokensInfo.sUSDS?.symbol) {
    return 'usdc-to-susds'
  }

  if (opts.token.symbol === opts.tokensInfo.DAI?.symbol && opts.savingsToken.symbol === opts.tokensInfo.sDAI?.symbol) {
    return 'dai-to-sdai'
  }

  if (opts.token.symbol === TokenSymbol('USDC') && opts.savingsToken.symbol === opts.tokensInfo.sDAI?.symbol) {
    return 'usdc-to-sdai'
  }

  raise('Savings action type not recognized')
}
