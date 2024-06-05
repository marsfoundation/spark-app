import { waitFor } from '@testing-library/react'
import { expect } from 'vitest'

export async function expectToStayUndefined(fn: () => any): Promise<void> {
  await expect(
    waitFor(() => expect(fn()).toBeDefined(), {
      timeout: 250,
    }),
  ).rejects.toThrow('expected undefined not to be undefined')
}
