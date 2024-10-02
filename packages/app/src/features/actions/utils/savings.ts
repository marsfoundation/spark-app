import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { raise } from '@/utils/assert.ts'
import { toBigInt } from '@/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { gnosis } from 'viem/chains'

export function calculateGemConversionFactor({
  gemDecimals,
  assetsTokenDecimals,
}: { gemDecimals: number; assetsTokenDecimals: number }): BigNumber {
  return BigNumber(10).pow(assetsTokenDecimals - gemDecimals)
}

export interface CalculateAssetsMinAmountOutParams {
  gem: Token
  assetsTokenDecimals: number
  actionValue: NormalizedUnitNumber
}

export function calculateAssetsMinAmountOut({
  gem,
  assetsTokenDecimals,
  actionValue,
}: CalculateAssetsMinAmountOutParams): bigint {
  const gemConversionFactor = calculateGemConversionFactor({
    gemDecimals: gem.decimals,
    assetsTokenDecimals,
  })
  return toBigInt(gem.toBaseUnit(actionValue).multipliedBy(gemConversionFactor))
}

export type SavingsDepositActionPath =
  | 'usds-to-susds'
  | 'dai-to-susds'
  | 'usdc-to-susds'
  | 'dai-to-sdai'
  | 'usdc-to-sdai'
  | 'sexy-dai-to-sdai'

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

  raise('Savings action type not recognized')
}
