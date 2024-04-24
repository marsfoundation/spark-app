import { getAddress, isAddress } from 'viem'

import { Opaque } from './types'

/**
 * Represents an Ethereum address with a checksum. ie. 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5
 */
export type CheckedAddress = Opaque<`0x${string}`, 'CheckedAddress'>
export function CheckedAddress(value: string): CheckedAddress {
  if (!isAddress(value)) {
    throw new Error(`Invalid address: ${value}`)
  }
  return getAddress(value) as CheckedAddress
}
