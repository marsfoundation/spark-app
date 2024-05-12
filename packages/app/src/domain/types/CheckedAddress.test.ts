import { CheckedAddress } from './CheckedAddress'

const validChecksummedAddress = '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5'

describe(CheckedAddress.name, () => {
  test('works with a valid address', () => {
    expect(CheckedAddress(validChecksummedAddress)).toEqual(validChecksummedAddress)
  })

  test('transforms valid, not checksummed address into a checksummed one', () => {
    expect(CheckedAddress(validChecksummedAddress.toLowerCase())).toEqual(validChecksummedAddress)
  })

  test('throws with not valid address', () => {
    expect(() => CheckedAddress('not-an-address')).toThrow('Invalid address: not-an-address')
    expect(() => CheckedAddress('0x0')).toThrow('Invalid address: 0x0')
  })
})
