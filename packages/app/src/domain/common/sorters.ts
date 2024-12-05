import BigNumber from 'bignumber.js'

import { FilterObjectValues } from '@/utils/types'

import { Percentage } from '@marsfoundation/common-universal'
import { Token } from '../types/Token'
import { TokensInfo } from '../wallet/useTokens/TokenInfo'
import { TokenWithBalance } from './types'

export function sortByUsdValue<T extends { token: Token }, K extends keyof FilterObjectValues<T, BigNumber>>(
  a: T,
  b: T,
  key: K,
): number {
  const aUsdValue = a.token.toUSD((a as any)[key])
  const bUsdValue = b.token.toUSD((b as any)[key])
  return aUsdValue.comparedTo(bUsdValue)
}

export function sortByAPY(a: Percentage | undefined, b: Percentage | undefined): number {
  if (!a && !b) {
    return 0
  }
  if (!b) {
    return 1
  }
  if (!a) {
    return -1
  }
  return a.comparedTo(b)
}

export function sortByUsdValueWithUsdsPriority(tokens: TokenWithBalance[], tokensInfo: TokensInfo): TokenWithBalance[] {
  return tokens.sort((a, b) => {
    const usdValueComparison = b.token.toUSD(b.balance).comparedTo(a.token.toUSD(a.balance))
    if (usdValueComparison !== 0) return usdValueComparison
    // Prioritize token with USDS symbol
    if (tokensInfo.USDS) {
      if (a.token.symbol === tokensInfo.USDS.symbol) return -1
      if (b.token.symbol === tokensInfo.USDS.symbol) return 1
    }
    return 0
  })
}
