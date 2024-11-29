import { type Hash as ViemHash, keccak256, toHex } from 'viem'
import { assert } from '../assert'
import { Hex } from './Hex'
import { Opaque } from './Opaque'

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
