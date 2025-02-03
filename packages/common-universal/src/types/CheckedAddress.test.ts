import { expect } from 'earl'
import { describe, it } from 'mocha'

import { CheckedAddress } from './CheckedAddress.js'

const validChecksummedAddress = '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5'

describe(CheckedAddress.name, () => {
  it('works with a valid address', () => {
    expect(CheckedAddress(validChecksummedAddress)).toEqual(validChecksummedAddress as CheckedAddress)
  })

  it('transforms valid, not checksummed address into a checksummed one', () => {
    expect(CheckedAddress(validChecksummedAddress.toLowerCase())).toEqual(validChecksummedAddress as CheckedAddress)
  })

  it('throws with not valid address', () => {
    expect(() => CheckedAddress('not-an-address')).toThrow('Invalid address: not-an-address')
    expect(() => CheckedAddress('0x0')).toThrow('Invalid address: 0x0')
  })

  describe(CheckedAddress.random.name, () => {
    it('generates a random address', () => {
      const address = CheckedAddress.random()
      expect(address).toMatchRegex(/^0x[0-9a-fA-F]{40}$/)
    })

    it('generates a random address with prefix', () => {
      const address = CheckedAddress.random('alice')
      expect(address.toLowerCase()).toMatchRegex(/^0x00000000a11ce[0-9a-f]{27}$/)
    })
  })

  describe(CheckedAddress.formatShort.name, () => {
    it('formats short address', () => {
      const address = CheckedAddress('0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97')
      expect(CheckedAddress.formatShort(address)).toEqual('0x4838...5f97')
    })
  })
})
