import BigNumber from 'bignumber.js'
import { expect } from 'earl'
import { describe, it } from 'mocha'
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
})
