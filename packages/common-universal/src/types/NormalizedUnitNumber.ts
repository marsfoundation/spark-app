import BigNumber from 'bignumber.js'
import { NumberLike, bigNumberify } from '../math/bigNumber.js'
import { BaseUnitNumber } from './BaseUnitNumber.js'
import { Opaque } from './Opaque.js'

/**
 * Represents a base number divided by decimals i.e. 1.5 (DAI)
 */
export type NormalizedUnitNumber = Opaque<BigNumber, 'NormalizedUnitNumber'>
export function NormalizedUnitNumber(value: NumberLike): NormalizedUnitNumber {
  const result = bigNumberify(value)
  return result as NormalizedUnitNumber
}

NormalizedUnitNumber.toBaseUnit = function toBaseUnit(value: NormalizedUnitNumber, decimals: number): BaseUnitNumber {
  const lowerPrecisionNumber = value.decimalPlaces(decimals, BigNumber.ROUND_DOWN)
  return BaseUnitNumber(lowerPrecisionNumber.shiftedBy(decimals))
}

NormalizedUnitNumber.min = function min(
  a: NormalizedUnitNumber,
  b: NormalizedUnitNumber,
  ...rest: NormalizedUnitNumber[]
): NormalizedUnitNumber {
  let min = a
  const values = [b, ...rest]
  for (const value of values) {
    if (value.lt(min)) {
      min = value
    }
  }
  return min
}
