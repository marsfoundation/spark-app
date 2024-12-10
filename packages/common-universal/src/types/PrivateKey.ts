import type { Hex as ViemHex } from 'viem'

import { assert } from '../assert/assert.js'
import { Opaque } from './Opaque.js'

/**
 * Represents a private key i.e. 0x2cb73077a1d3cb0591e3238fa1e69865c06655509fd4159f6284fa96642dfe7c
 * Prefer than using Hex type as it avoid printing the private key in error messages (for example if 0x prefix was skipped).
 */
export type PrivateKey = Opaque<ViemHex, 'PrivateKey'>
export function PrivateKey(privateKey: string): PrivateKey {
  assert(privateKey.match(/^0x[0-9a-fA-F]{64}$/), 'Invalid private key')
  return privateKey as PrivateKey
}
