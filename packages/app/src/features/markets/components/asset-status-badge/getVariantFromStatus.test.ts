import { describe, test, expect } from 'bun:test'

import { getVariantFromStatus } from './getVariantFromStatus'

describe(getVariantFromStatus.name, () => {
  test("should return green for status 'yes'", () => {
    expect(getVariantFromStatus('yes')).toBe('green')
  })

  test("should return gray for status 'no'", () => {
    expect(getVariantFromStatus('no')).toBe('gray')
  })

  test("should return red for status 'supply-cap-reached'", () => {
    expect(getVariantFromStatus('supply-cap-reached')).toBe('red')
  })

  test("should return red for status 'borrow-cap-reached'", () => {
    expect(getVariantFromStatus('borrow-cap-reached')).toBe('red')
  })

  test('should return orange for any other status', () => {
    expect(getVariantFromStatus('only-in-isolation-mode')).toBe('orange')
    expect(getVariantFromStatus('only-in-siloed-mode')).toBe('orange')
  })
})
