import { expect } from 'earl'
import { maxBigInt, minBigInt } from './bigInt.js'

describe(maxBigInt.name, () => {
  it('finds max with multiple values', () => {
    expect(maxBigInt(1n, 2n, 3n, 10n, 7n, -5n)).toEqual(10n)
  })

  it('finds max with a single value', () => {
    expect(maxBigInt(1n)).toEqual(1n)
  })

  it('throws on empty array', () => {
    expect(() => maxBigInt()).toThrow('Requires at least 1 arg')
  })
})

describe(minBigInt.name, () => {
  it('finds min with multiple values', () => {
    expect(minBigInt(1n, 2n, 3n, 10n, 7n, -5n)).toEqual(-5n)
  })

  it('finds min with a single value', () => {
    expect(minBigInt(1n)).toEqual(1n)
  })

  it('throws on empty array', () => {
    expect(() => minBigInt()).toThrow('Requires at least 1 arg')
  })
})
