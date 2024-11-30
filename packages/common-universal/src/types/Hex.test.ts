import { expect } from 'earl'
import { describe, it } from 'mocha'

import { Hex } from './Hex'

describe(Hex.name, () => {
  it('works with an argument correctly representing base value', () => {
    expect(Hex('0x1234567890abcdefABCDEF')).toEqual('0x1234567890abcdefABCDEF' as Hex)
    expect(Hex('0x0')).toEqual('0x0' as Hex)
    expect(Hex('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')).toEqual(
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Hex,
    )
  })

  it('throws if value argument has does not start with "0x"', () => {
    expect(() => Hex('1234567890abcdefABCDEF')).toThrow('Invalid hex: 1234567890abcdefABCDEF')
  })

  it('throws if value argument does not have any characters after "0x"', () => {
    expect(() => Hex('0x')).toThrow('Invalid hex: 0x')
  })

  it('throws if value argument has characters from outside of the range', () => {
    expect(() => Hex('0xNotARealHex')).toThrow('Invalid hex: 0xNotARealHex')
  })
})