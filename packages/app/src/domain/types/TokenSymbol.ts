import assert from 'node:assert'

import { Opaque } from './types'

/**
 * Represents a token symbol. ie. DAI
 */
export type TokenSymbol = Opaque<string, 'TokenSymbol'>
export function TokenSymbol(symbol: string): TokenSymbol {
  assert(symbol.length > 0 && symbol.length <= 7, 'Token symbol should be between 1 and 7 characters.')

  return symbol as TokenSymbol
}
