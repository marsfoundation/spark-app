import { assert } from '../assert/assert.js'

export function maxBigInt(...values: bigint[]): bigint {
  assert(values.length > 0, 'Requires at least 1 arg')
  return values.reduce((max, val) => (val > max ? val : max))
}

export function minBigInt(...values: bigint[]): bigint {
  assert(values.length > 0, 'Requires at least 1 arg')
  return values.reduce((min, val) => (val < min ? val : min))
}
