import { vi } from 'vitest'

import { applyTransformers } from './applyTransformers'

describe(applyTransformers.name, () => {
  it('returns result of the first matching transformer', () => {
    const expectedResult = 'result'
    const inputs = [1, 2, 3, 4]
    const transformers = [vi.fn(() => undefined), vi.fn(() => expectedResult), vi.fn(() => undefined)]

    const result = applyTransformers(inputs)(transformers)

    expect(result).toBe(expectedResult)
    expect(transformers[0]).toHaveBeenCalledOnce()
    expect(transformers[1]).toHaveBeenCalledOnce()
    expect(transformers[2]).not.toHaveBeenCalledOnce()
  })

  it('returns null if transformer returned it', () => {
    const expectedResult = 'result'
    const inputs = [1, 2, 3, 4]
    const transformers = [() => null, () => expectedResult]

    const result = applyTransformers(inputs)(transformers)

    expect(result).toBe(null)
  })
})
