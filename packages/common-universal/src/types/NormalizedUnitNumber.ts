import BigNumber from 'bignumber.js'
import { assert } from '../assert/assert.js'
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

NormalizedUnitNumber.min = function min(...values: NormalizedUnitNumber[]): NormalizedUnitNumber {
  assert(values.length > 0, 'Requires at least 1 arg')
  let min = values[0]
  for (let i = 1; i < values.length; i++) {
    if (values[i]!.lt(min!)) {
      min = values[i]
    }
  }
  return min!
}
