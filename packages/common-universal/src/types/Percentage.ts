import BigNumber from 'bignumber.js'

import { assert, NumberLike, bigNumberify } from '../index'
import { Opaque } from './Opaque'

/**
 * Represents a percentage as a fraction number i.e. 0.5 (means 50%)
 * For percentages greater than 1, use the allowMoreThan1 flag.
 */
export type Percentage = Opaque<BigNumber, 'Percentage'>
export function Percentage(_value: NumberLike, allowMoreThan1 = false): Percentage {
  const value = bigNumberify(_value)
  assert(value.gte(0), 'Percentage value should be greater than or equal to 0.')
  if (!allowMoreThan1) {
    assert(value.lte(1), 'Percentage value should be less than or equal to 1.')
  }

  return value as Percentage
}
