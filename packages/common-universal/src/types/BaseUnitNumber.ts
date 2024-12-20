import BigNumber from 'bignumber.js'

import { assert, NumberLike } from '../index.js'
import { bigNumberify } from '../math/index.js'
import { NormalizedUnitNumber } from './NormalizedUnitNumber.js'
import { Opaque } from './Opaque.js'

/**
 * Represents a base number i.e. 1.5 * 10^18 (DAI)
 */
export type BaseUnitNumber = Opaque<BigNumber, 'BaseUnitNumber'>
export function BaseUnitNumber(value: NumberLike): BaseUnitNumber {
  const result = bigNumberify(value)
  assert(!result.dp(), 'Value should not have decimal points in its representation.')

  return result as BaseUnitNumber
}

BaseUnitNumber.toNormalizedUnit = (value: BaseUnitNumber, decimals: number): NormalizedUnitNumber => {
  return NormalizedUnitNumber(value.shiftedBy(-decimals))
}
