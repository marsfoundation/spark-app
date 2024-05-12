import BigNumber from 'bignumber.js'

import { BaseUnitNumber, NormalizedUnitNumber, Percentage } from './NumericValues'

describe(BaseUnitNumber.name, () => {
  test('works with an argument correctly representing base value', () => {
    expect(BaseUnitNumber(10n ** 3n)).toEqual(new BigNumber(1000))
    expect(BaseUnitNumber(1000)).toEqual(new BigNumber(1000))
    expect(BaseUnitNumber('1000')).toEqual(new BigNumber(1000))
    expect(BaseUnitNumber(new BigNumber(1000))).toEqual(new BigNumber(1000))
  })

  test('throws if value argument has decimal points', () => {
    expect(() => BaseUnitNumber(123.45)).toThrow('Value should not have decimal points in its representation.')
  })

  test('throws if value argument is negative number', () => {
    expect(NormalizedUnitNumber(-1)).toEqual(new BigNumber(-1))
  })

  test('throws if value argument is non-numeric value', () => {
    expect(() => BaseUnitNumber('non-numeric')).toThrow('Value argument: non-numeric cannot be converted to BigNumber.')
  })
})

describe(NormalizedUnitNumber.name, () => {
  test('works for a numeric value', () => {
    expect(NormalizedUnitNumber(10n ** 3n)).toEqual(new BigNumber(1000))
    expect(NormalizedUnitNumber(1000)).toEqual(new BigNumber(1000))
    expect(NormalizedUnitNumber('1000')).toEqual(new BigNumber(1000))
    expect(NormalizedUnitNumber(new BigNumber(1000))).toEqual(new BigNumber(1000))
    expect(NormalizedUnitNumber('123.456')).toEqual(new BigNumber(123.456))
  })

  test('works with negative numbers', () => {
    expect(NormalizedUnitNumber(-1)).toEqual(new BigNumber(-1))
  })

  test('throws if value argument is non-numeric value', () => {
    expect(() => NormalizedUnitNumber('123,456')).toThrow('Value argument: 123,456 cannot be converted to BigNumber.')
    expect(() => NormalizedUnitNumber('non-numeric')).toThrow(
      'Value argument: non-numeric cannot be converted to BigNumber.',
    )
  })
})

describe(Percentage.name, () => {
  test('works with a value from 0 to 1', () => {
    expect(Percentage(0)).toEqual(new BigNumber(0))
    expect(Percentage(1)).toEqual(new BigNumber(1))
    expect(Percentage(0.25)).toEqual(new BigNumber(0.25))
  })

  test('throws for a value outside of a 0 to 1 range', () => {
    expect(() => Percentage(-1)).toThrow('Percentage value should be greater than or equal to 0.')
    expect(() => Percentage(2)).toThrow('Percentage value should be less than or equal to 1.')
  })
})
