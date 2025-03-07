import BigNumber from 'bignumber.js'
import { expect } from 'earl'
import { describe, it } from 'mocha'
import { Percentage } from './Percentage.js'

describe(Percentage.name, () => {
  it('works with a value from 0 to 1', () => {
    expect(Percentage(0)).toEqual(new BigNumber(0) as Percentage)
    expect(Percentage(1)).toEqual(new BigNumber(1) as Percentage)
    expect(Percentage(0.25)).toEqual(new BigNumber(0.25) as Percentage)
  })

  it('throws for a value outside of a 0 to 1 range', () => {
    expect(() => Percentage(-1)).toThrow('Percentage value should be greater than or equal to 0.')
    expect(() => Percentage(2)).toThrow('Percentage value should be less than or equal to 1.')
  })

  describe(Percentage.fromBips.name, () => {
    it('converts bips to a percentage', () => {
      expect(Percentage.fromBips(0)).toEqual(new BigNumber(0) as Percentage)
      expect(Percentage.fromBips(10000)).toEqual(new BigNumber(1) as Percentage)
      expect(Percentage.fromBips(2500)).toEqual(new BigNumber(0.25) as Percentage)
      expect(Percentage.fromBips(1)).toEqual(new BigNumber(0.0001) as Percentage)
      expect(Percentage.fromBips(6)).toEqual(new BigNumber(0.0006) as Percentage)
    })

    it('throws for values outside of a 0 to 10000 range', () => {
      expect(() => Percentage.fromBips(-1)).toThrow('Percentage value should be greater than or equal to 0.')
      expect(() => Percentage.fromBips(10001)).toThrow('Percentage value should be less than or equal to 1.')
    })
  })
})
