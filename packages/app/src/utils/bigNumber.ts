import { assert } from '@/utils/assert'
import BigNumber from 'bignumber.js'

export type NumberLike = string | number | BigNumber | bigint

/**
 * Converts number-like value to BigNumber.
 *
 * @param value Number-like value used for a conversion (string | number | BigNumber | bigint)
 * @returns BigNumber representation of value
 * @throws If value argument cannot be converted to BigNumber
 */
export function bigNumberify(value: NumberLike): BigNumber {
  const result = new BigNumber(value.toString())
  assert(!result.isNaN(), `Value argument: ${value} cannot be converted to BigNumber.`)

  return result
}

/**
 * Parses number-like value to BigNumber.
 *
 * @param value Number-like value used for a conversion (string | number | BigNumber | bigint), empty string or undefined
 * @param [defaultValue] Default used in a case when a value cannot be converted to a BigNumber
 * @returns BigNumber representation of a value/defaultValue
 * @throws If value argument cannot be converted to a BigNumber and no default value is provided
 */
export function parseBigNumber(value: NumberLike | undefined, defaultValue?: number): BigNumber {
  assert(value !== undefined || defaultValue !== undefined, 'At least one argument must be defined.')

  const valueResult = BigNumber(value !== undefined ? value.toString() : Number.NaN)
  const defaultValueResult = BigNumber(defaultValue !== undefined ? defaultValue.toString() : Number.NaN)

  assert(!valueResult.isNaN() || !defaultValueResult.isNaN(), 'Value cannot be parsed to BigNumber.')

  return valueResult.isNaN() ? defaultValueResult : valueResult
}

export function toBigInt(value: NumberLike): bigint {
  // @todo explicit check if value has decimal part
  return BigInt(bigNumberify(value).toFixed())
}

export function nonZeroOrDefault<T extends BigNumber>(value: T, defaultValue: T): T {
  return value.isZero() ? defaultValue : value
}

export function toHex(value: BigNumber): string {
  return `0x${value.toString(16)}`
}

export function getWholePart(value: BigNumber): string {
  const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
  return formatter.format(value.integerValue(BigNumber.ROUND_DOWN).toNumber())
}

export function getFractionalPart(value: BigNumber, precision: number): string {
  precision = Math.max(precision, 2)
  return value.minus(value.integerValue(BigNumber.ROUND_DOWN)).toFixed(precision).slice(1)
}
