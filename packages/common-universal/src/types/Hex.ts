import type { Hex as ViemHex } from 'viem'

import { assert, asciiToHex, randomPartialHex } from '../index'
import { Opaque } from './Opaque'

/**
 * Any hex value i.e. 0x1234567890abcdefABCDEF.
 * Has to start with "0x"
 */
export type Hex = Opaque<ViemHex, 'Hex'>
export function Hex(hex: string): Hex {
  assert(hex.match(/^0x[0-9a-fA-F]+$/), `Invalid hex: ${hex}`)
  return hex as Hex
}

Hex.random = (ascii = '', length = 64): Hex => {
  assert(ascii.length <= length, `Ascii prefix too long: ${ascii}`)
  return Hex(`0x${asciiToHex(ascii)}${randomPartialHex(length - ascii.length)}`)
}
