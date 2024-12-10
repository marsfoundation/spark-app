import type { Hex as ViemHex } from 'viem'

import { Opaque } from './Opaque'
import { assert } from '../assert/assert'

export type PrivateKey = Opaque<ViemHex, 'PrivateKey'>
export function PrivateKey(privateKey: string): PrivateKey {
  assert(privateKey.match(/^0x[0-9a-fA-F]{64}$/), 'Invalid private key')
  return privateKey as PrivateKey
}
