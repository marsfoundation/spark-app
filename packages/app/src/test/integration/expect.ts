import { waitFor } from '@testing-library/react'
import { expect } from 'vitest'

export async function expectToStay<T>(fn: () => T, expected: T): Promise<void> {
  await expect(
    waitFor(() => expect(fn()).not.toEqual(expected), {
      timeout: 250,
    }),
    `expected value ${expected} to not change`,
  ).rejects.toThrow()
}

export async function expectToStayUndefined(fn: () => any): Promise<void> {
  await expect(
    waitFor(() => expect(fn()).toBeDefined(), {
      timeout: 250,
    }),
  ).rejects.toThrow('expected undefined not to be undefined')
}
