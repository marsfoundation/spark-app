import { expect } from 'earl'
import { describe, it } from 'mocha'

import { PrivateKey } from './PrivateKey'

// Only publicly well known private keys used here
describe(PrivateKey.name, () => {
  it('works with correct private key', () => {
    expect(PrivateKey('0x2cb73077a1d3cb0591e3238fa1e69865c06655509fd4159f6284fa96642dfe7c')).toEqual(
      '0x2cb73077a1d3cb0591e3238fa1e69865c06655509fd4159f6284fa96642dfe7c' as PrivateKey,
    )
    expect(PrivateKey('0xd252696e44aeb1aee506349a92c9c76059a1bac39268b4755b12b52cd1467947')).toEqual(
      '0xd252696e44aeb1aee506349a92c9c76059a1bac39268b4755b12b52cd1467947' as PrivateKey,
    )
  })

  it('throws if value argument has does not start with "0x"', () => {
    expect(() => PrivateKey('d252696e44aeb1aee506349a92c9c76059a1bac39268b4755b12b52cd1467947')).toThrow(
      'Invalid private key',
    )
  })

  it('throws if value argument does not have any characters after "0x"', () => {
    expect(() => PrivateKey('0x')).toThrow('Invalid private key')
  })

  it('throws if value argument is too short', () => {
    expect(() => PrivateKey('0xd252696e44aeb1aee506349a92c9c76059a1bac39268b4755b12b52cd146794')).toThrow(
      'Invalid private key',
    )
  })

  it('throws if value argument is too long', () => {
    expect(() => PrivateKey('0xd252696e44aeb1aee506349a92c9c76059a1bac39268b4755b12b52cd14679471')).toThrow(
      'Invalid private key',
    )
  })

  it('throws if value argument has characters from outside of the range', () => {
    expect(() => PrivateKey('0xNotRealPK00001aee506349a92c9c76059a1bac39268b4755b12b52cd1467947')).toThrow(
      'Invalid private key',
    )
  })
})
