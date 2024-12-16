import { getAddress, isAddress } from 'viem'

import { assert } from '../assert/assert.js'
import { asciiToHex, randomPartialHex } from '../math/hexUtils.js'
import { Opaque } from './Opaque.js'

/**
 * Represents an Ethereum address with a checksum. i.e. 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5
 */
export type CheckedAddress = Opaque<`0x${string}`, 'CheckedAddress'>
export function CheckedAddress(value: string): CheckedAddress {
  if (!isAddress(value)) {
    throw new Error(`Invalid address: ${value}`)
  }
  return getAddress(value) as CheckedAddress
}

/**
 * Generates a random address. Tries to represent desired ascii prefix as hex value. Helps to identify transactions in the logs.
 */
CheckedAddress.random = (asciiPrefix = ''): CheckedAddress => {
  const hexPrefix = asciiToHex(asciiPrefix)
  const postfixLength = 40 - hexPrefix.length - 4
  assert(postfixLength >= 0, `Prefix too long: ${asciiPrefix}`)
  const address = `0000${hexPrefix}${randomPartialHex(postfixLength)}`

  return CheckedAddress(`0x${address}`)
}
