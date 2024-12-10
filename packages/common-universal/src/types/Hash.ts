import { type Hash as ViemHash, keccak256, toHex } from 'viem'

import { assert } from '../assert/assert.js'
import { Hex } from './Hex.js'
import { Opaque } from './Opaque.js'

/**
 * 256 bit hash value i.e. 0x8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6fbd584b91a4790f
 */
export type Hash = Opaque<ViemHash, 'Hash'>
export function Hash(hash: string): Hash {
  assert(hash.match(/^0x[0-9a-fA-F]{64}$/), `Invalid hash: ${hash}`)
  return hash as Hash
}

Hash.random = (ascii = ''): Hash => {
  return Hash(Hex.random(ascii, 64))
}

Hash.fromText = (text: string): Hash => {
  return Hash(keccak256(toHex(text)))
}
