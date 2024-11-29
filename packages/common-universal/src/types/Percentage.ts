import BigNumber from 'bignumber.js'

import { assert, NumberLike, bigNumberify } from '../index'
import { Opaque } from './Opaque'

/**
 * Represents a percentage as a fraction. ie. 0.5 (50%)
 * Percentages can be often greater that 1 (100%) so we need to allow that.
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
