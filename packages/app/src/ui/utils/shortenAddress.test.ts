import { shortenAddress } from './shortenAddress'

const address = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'

describe(shortenAddress.name, () => {
  test('should shorten address when not providing options', () => {
    expect(shortenAddress(address)).toBe('0xAb58...eC9B')
  })

  test('should shorten address when using custom options', () => {
    expect(shortenAddress(address, { startLength: 10, endLength: 2 })).toBe('0xAb5801a7...9B')
    expect(shortenAddress(address, { startLength: 2, endLength: 4 })).toBe('0x...eC9B')
    expect(shortenAddress(address, { startLength: 4, endLength: 2 })).toBe('0xAb...9B')
  })
})
