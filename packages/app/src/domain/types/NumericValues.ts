import BigNumber from 'bignumber.js'
import invariant from 'tiny-invariant'

import { NumberLike, bigNumberify } from '../../utils/bigNumber'
import { Opaque } from './types'

/**
 * Represents a base number. Always positive. ie. 1.5 * 10^18 (DAI)
 */
export type BaseUnitNumber = Opaque<BigNumber, 'BaseUnitNumber'>
export function BaseUnitNumber(value: NumberLike): BaseUnitNumber {
  const result = bigNumberify(value)
  invariant(!result.dp(), 'Value should not have decimal points in its representation.')

  return result as BaseUnitNumber
}

/**
 * Represents a base number divided by decimals. Always positive. ie. 1.5 (DAI)
 */
export type NormalizedUnitNumber = Opaque<BigNumber, 'NormalizedUnitNumber'>
export function NormalizedUnitNumber(value: NumberLike): NormalizedUnitNumber {
  const result = bigNumberify(value)
  return result as NormalizedUnitNumber
}

/**
 * Represents a percentage as a fraction. ie. 0.5 (50%)
 * Percentages can be often greater that 1 (100%) so we need to allow that.
 */
export type Percentage = Opaque<BigNumber, 'Percentage'>
export function Percentage(_value: NumberLike, allowMoreThan1 = false): Percentage {
  const value = bigNumberify(_value)
  invariant(value.gte(0), 'Percentage value should be greater than or equal to 0.')
  if (!allowMoreThan1) {
    invariant(value.lte(1), 'Percentage value should be less than or equal to 1.')
  }

  return value as Percentage
}
