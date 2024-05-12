import { describe, test, expect } from 'bun:test'

import { bigNumberify } from '@/utils/bigNumber'

import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { findSignificantPrecision, formatHealthFactor, formatPercentage, formFormat } from './format'

describe(formatPercentage.name, () => {
  test('formats whole numbers', () => {
    const tests: [number, string][] = [
      [0, '0.00%'],
      [1, '100.00%'],
      [2, '200.00%'],
      [123_45, '1,234,500.00%'],
      [999_999, '99,999,900.00%'],
    ]

    tests.forEach(([value, expected]) => {
      expect(formatPercentage(Percentage(value, true))).toEqual(expected)
    })
  })

  test('formats numbers with fractional part', () => {
    const tests: [number, string][] = [
      [0.1, '10.00%'],
      [0.2, '20.00%'],
      [0.5, '50.00%'],
      [0.01, '1.00%'],
      [0.001, '0.10%'],
      [0.0001, '0.01%'],
      [0.123, '12.30%'],
      [0.1234, '12.34%'],
      [0.12345, '12.35%'],
      [0.123456, '12.35%'],
      [0.999, '99.90%'],
      [0.9999, '99.99%'],
      [0.99999, '100.00%'],
    ]

    tests.forEach(([value, expected]) => {
      expect(formatPercentage(Percentage(value, true))).toEqual(expected)
    })
  })

  test('formats small numbers', () => {
    const tests: [number, string][] = [
      [0.0001, '0.01%'],
      [0.00001, '<0.01%'],
      [0.00002, '<0.01%'],
      [0.000001, '<0.01%'],
      [0.00009999999, '<0.01%'],
    ]

    tests.forEach(([value, expected]) => {
      expect(formatPercentage(Percentage(value, true))).toEqual(expected)
    })
  })
})

describe(formatHealthFactor.name, () => {
  test('handles undefined', () => {
    expect(formatHealthFactor(undefined)).toEqual('0.0')
  })

  test('formats whole numbers', () => {
    const tests: [number, string][] = [
      [0, '0'],
      [1, '1'],
      [2, '2'],
      [40, '40'],
      [999, '999'],
    ]

    tests.forEach(([value, expected]) => {
      expect(formatHealthFactor(NormalizedUnitNumber(value))).toEqual(expected)
    })
  })

  test('formats numbers with fractional part', () => {
    const tests: [number, string][] = [
      [0.1, '0.1'],
      [0.2, '0.2'],
      [1.123, '1.12'],
      [2.125, '2.13'],
      [3.12345, '3.12'],
      [9.999, '10'],
      [9.99, '9.99'],
    ]

    tests.forEach(([value, expected]) => {
      expect(formatHealthFactor(NormalizedUnitNumber(value))).toEqual(expected)
    })
  })
})

describe(formFormat.name, () => {
  test('formats bigger numbers', () => {
    expect(formFormat(bigNumberify(100.2), 18)).toBe('100.2')
  })

  test('avoids unnecessary zeroes', () => {
    expect(formFormat(bigNumberify(0), 10)).toBe('0')
    expect(formFormat(bigNumberify(1), 10)).toBe('1')
  })

  test('rounds down', () => {
    expect(formFormat(bigNumberify(0.9999), 2)).toBe('0.99')
  })
})

describe(findSignificantPrecision.name, () => {
  test('finds precision for stablecoins', () => {
    expect(findSignificantPrecision(bigNumberify(1), 2)).toBe(2)
  })

  test('finds precision for BTC like', () => {
    expect(findSignificantPrecision(bigNumberify(48_000), 2)).toBe(6)
  })

  test('finds precision for ETH like', () => {
    expect(findSignificantPrecision(bigNumberify(2_500), 2)).toBe(5)
  })

  test('finds precision for coins with tiny prices', () => {
    expect(findSignificantPrecision(bigNumberify(0.0001), 2)).toBe(0)
  })

  test('finds precision for BTC like and whole dollars', () => {
    expect(findSignificantPrecision(bigNumberify(48_000), 0)).toBe(4)
  })
})
