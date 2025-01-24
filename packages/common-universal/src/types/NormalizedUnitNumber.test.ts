import BigNumber from 'bignumber.js'
import { expect } from 'earl'
import { describe, it } from 'mocha'
import { AssertionError } from '../assert/AssertionError.js'
import { BaseUnitNumber } from './BaseUnitNumber.js'
import { NormalizedUnitNumber } from './NormalizedUnitNumber.js'

describe(NormalizedUnitNumber.name, () => {
  it('works for a numeric value', () => {
    expect(NormalizedUnitNumber(10n ** 3n)).toEqual(new BigNumber(1000) as NormalizedUnitNumber)
    expect(NormalizedUnitNumber(1000)).toEqual(new BigNumber(1000) as NormalizedUnitNumber)
    expect(NormalizedUnitNumber('1000')).toEqual(new BigNumber(1000) as NormalizedUnitNumber)
    expect(NormalizedUnitNumber(new BigNumber(1000))).toEqual(new BigNumber(1000) as NormalizedUnitNumber)
    expect(NormalizedUnitNumber('123.456')).toEqual(new BigNumber(123.456) as NormalizedUnitNumber)
  })

  it('works with negative numbers', () => {
    expect(NormalizedUnitNumber(-1)).toEqual(new BigNumber(-1) as NormalizedUnitNumber)
  })

  it('throws if value argument is non-numeric value', () => {
    expect(() => NormalizedUnitNumber('123,456')).toThrow('Value argument: 123,456 cannot be converted to BigNumber.')
    expect(() => NormalizedUnitNumber('non-numeric')).toThrow(
      'Value argument: non-numeric cannot be converted to BigNumber.',
    )
  })

  it(`${NormalizedUnitNumber.toString.name} does not use scientific notation for big numbers`, () => {
    expect(NormalizedUnitNumber(10n ** 100n).toString()).toEqual(`1${'0'.repeat(100)}`)
  })

  describe(NormalizedUnitNumber.toBaseUnit.name, () => {
    it('works with standard decimals', () => {
      expect(NormalizedUnitNumber.toBaseUnit(NormalizedUnitNumber(2.5), 18)).toEqual(
        BaseUnitNumber(2_500000000000000000n),
      )
      expect(NormalizedUnitNumber.toBaseUnit(NormalizedUnitNumber(10), 6)).toEqual(BaseUnitNumber(10_000000))
    })

    it('rounds down when precision is greater than decimals', () => {
      expect(
        NormalizedUnitNumber.toBaseUnit(NormalizedUnitNumber('1.555555555555555555555555555555555555'), 18),
      ).toEqual(BaseUnitNumber('1555555555555555555'))
    })
  })

  describe(NormalizedUnitNumber.min.name, () => {
    it('returns the smallest value', () => {
      expect(NormalizedUnitNumber.min(NormalizedUnitNumber(2), NormalizedUnitNumber(1))).toEqual(
        NormalizedUnitNumber(1),
      )
    })

    it('returns the smallest value when there are more than 2 arguments', () => {
      expect(
        NormalizedUnitNumber.min(
          NormalizedUnitNumber(3),
          NormalizedUnitNumber(1),
          NormalizedUnitNumber(5),
          NormalizedUnitNumber(2),
        ),
      ).toEqual(NormalizedUnitNumber(1))
    })

    it('works with array', () => {
      const input = [NormalizedUnitNumber(3), NormalizedUnitNumber(1), NormalizedUnitNumber(5), NormalizedUnitNumber(2)]
      expect(NormalizedUnitNumber.min(...input)).toEqual(NormalizedUnitNumber(1))
    })

    it('return the argument if there is only 1 element', () => {
      expect(NormalizedUnitNumber.min(NormalizedUnitNumber(1))).toEqual(NormalizedUnitNumber(1))
    })

    it('throws if there are no arguments', () => {
      expect(() => NormalizedUnitNumber.min()).toThrow(AssertionError, 'Requires at least 1 arg')
    })
  })
})
