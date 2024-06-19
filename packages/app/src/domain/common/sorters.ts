import BigNumber from 'bignumber.js'

import { FilterObjectValues } from '@/utils/types'

import { Percentage } from '../types/NumericValues'
import { Token } from '../types/Token'

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
