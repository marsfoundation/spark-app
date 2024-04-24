import { StorybookErrorBoundary } from '@storybook/ErrorBoundary'
import { render } from '@testing-library/react'
import { ReactNode } from 'react'

/**
 * Expecting a rendering error is a bit tricky. We need to use error boundaries and even then normal matchers don't work. This function is a helper to make it easier.
 */
export function expectRenderingError(reactNode: ReactNode, expectedError: string) {
  const { baseElement } = render(<StorybookErrorBoundary>{reactNode}</StorybookErrorBoundary>)

  expect(baseElement.innerHTML).toContain(expectedError)
}
