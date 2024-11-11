import { assert } from '@/utils/assert'

import { Opaque } from './types'

/**
 * Represents a token symbol. ie. DAI
 */
export type TokenSymbol = Opaque<string, 'TokenSymbol'>
export function TokenSymbol(symbol: string): TokenSymbol {
  assert(symbol.length > 0 && symbol.length <= 9, 'Token symbol should be between 1 and 9 characters.')

  return symbol as TokenSymbol
}
