import { expect } from 'earl'
import { describe, it } from 'mocha'
import { Hash } from './Hash.js'

describe(Hash.name, () => {
  it('works with an argument correctly representing base value', () => {
    expect(Hash('0x8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6fbd584b91a4790f')).toEqual(
      '0x8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6fbd584b91a4790f' as Hash,
    )
    expect(Hash('0x60246d894bb46c6b29f9e5b61155a680586c0374e150c46faed2568fe9e2c484')).toEqual(
      '0x60246d894bb46c6b29f9e5b61155a680586c0374e150c46faed2568fe9e2c484' as Hash,
    )
  })

  it('throws if value argument has does not start with "0x"', () => {
    expect(() => Hash('8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6fbd584b91a4790f')).toThrow(
      'Invalid hash: 8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6fbd584b91a4790f',
    )
    expect(() => Hash('8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6fbd584b91a4790f12')).toThrow(
      'Invalid hash: 8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6fbd584b91a4790f12',
    )
  })

  it('throws if value argument has incorrect length', () => {
    expect(() => Hash('0x')).toThrow('Invalid hash: 0x')
    expect(() => Hash('0x8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6fbd584b91a4790')).toThrow(
      'Invalid hash: 0x8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6fbd584b91a4790',
    )
    expect(() => Hash('0x8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6fbd584b91a4790f1')).toThrow(
      'Invalid hash: 0x8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6fbd584b91a4790f1',
    )
  })

  it('throws if value argument has characters from outside of the range', () => {
    expect(() => Hash('0xWrongCharacters8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6')).toThrow(
      'Invalid hash: 0xWrongCharacters8a214de42955bf98e545d2e37df91e0da9b1c37d54d0b1fb6',
    )
  })
})
