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

NormalizedUnitNumber.toBaseUnit = (value: NormalizedUnitNumber, decimals: number): BaseUnitNumber => {
  return BaseUnitNumber(value.shiftedBy(decimals))
}

NormalizedUnitNumber.min = (a: NormalizedUnitNumber, b: NormalizedUnitNumber): NormalizedUnitNumber => {
  return a.lt(b) ? a : b
}
