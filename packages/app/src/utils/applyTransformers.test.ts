import { describe, test, expect, mock } from 'bun:test'

import { applyTransformers } from './applyTransformers'

describe(applyTransformers.name, () => {
  test('returns result of the first matching transformer', () => {
    const expectedResult = 'result'
    const inputs = [1, 2, 3, 4]
    const transformers = [mock(() => undefined), mock(() => expectedResult), mock(() => undefined)]

    const result = applyTransformers(inputs)(transformers)

    expect(result).toBe(expectedResult)
    expect(transformers[0]).toHaveBeenCalled()
    expect(transformers[1]).toHaveBeenCalled()
    expect(transformers[2]).not.toHaveBeenCalled()
  })

  test('returns null if transformer returned it', () => {
    const expectedResult = 'result'
    const inputs = [1, 2, 3, 4]
    const transformers = [() => null, () => expectedResult]

    const result = applyTransformers(inputs)(transformers)

    expect(result).toBe(null)
  })
})
