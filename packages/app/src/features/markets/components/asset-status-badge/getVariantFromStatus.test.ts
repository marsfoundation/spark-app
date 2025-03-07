import { describe } from 'vitest'

import { getVariantFromStatus } from './getVariantFromStatus'

describe(getVariantFromStatus.name, () => {
  it("should return green for status 'yes'", () => {
    expect(getVariantFromStatus('yes')).toBe('success')
  })

  it("should return gray for status 'no'", () => {
    expect(getVariantFromStatus('no')).toBe('neutral')
  })

  it("should return red for status 'supply-cap-reached'", () => {
    expect(getVariantFromStatus('supply-cap-reached')).toBe('error')
  })

  it("should return red for status 'borrow-cap-reached'", () => {
    expect(getVariantFromStatus('borrow-cap-reached')).toBe('error')
  })

  it('should return orange for any other status', () => {
    expect(getVariantFromStatus('only-in-isolation-mode')).toBe('warning')
    expect(getVariantFromStatus('only-in-siloed-mode')).toBe('warning')
  })
})
