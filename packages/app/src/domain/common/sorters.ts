import BigNumber from 'bignumber.js'

import { FilterObjectValues } from '@/utils/types'

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
