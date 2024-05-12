import { waitFor } from '@testing-library/react'
import {expect} from 'bun:test'

export async function expectToStayUndefined(fn: () => any): Promise<void> {
  await expect(
    waitFor(() => expect(fn()).toBeDefined(), {
      timeout: 250,
    }),
  ).rejects.toThrow() // tofix
}
