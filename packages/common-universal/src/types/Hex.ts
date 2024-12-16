import type { Hex as ViemHex } from 'viem'

import { assert, asciiToHex, randomPartialHex } from '../index.js'
import { Opaque } from './Opaque.js'

/**
 * Any hex value i.e. 0x1234567890abcdefABCDEF.
 * Has to start with "0x".
 * If allowEmpty is true, then empty hex "0x" is allowed. Sometimes data is modeled this way e.g. empty log data is represented as "0x".
 */
export type Hex = Opaque<ViemHex, 'Hex'>
export function Hex(hex: string, { allowEmpty = false } = {}): Hex {
  if (allowEmpty && hex === '0x') {
    return hex as Hex
  }

  assert(hex.match(/^0x[0-9a-fA-F]+$/), `Invalid hex: ${hex}`)
  return hex as Hex
}

Hex.random = (ascii = '', length = 64): Hex => {
  const constantHexPrefix = '0000'
  assert(ascii.length <= length - constantHexPrefix.length, `Ascii prefix too long: ${ascii}`)
  assert(length >= constantHexPrefix.length, `Total length too short: ${length}`)
  return Hex(
    `0x${constantHexPrefix}${asciiToHex(ascii)}${randomPartialHex(length - ascii.length - constantHexPrefix.length)}`,
  )
}
