import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'

import { ErrorBoundary } from './ErrorBoundary'

describe(ErrorBoundary.name, () => {
  it('renders fallback when error is thrown', () => {
    render(
      <ErrorBoundary fallback={<Fallback />}>
        <ToThrowOrNotToThrow shouldThrow={true}>Content</ToThrowOrNotToThrow>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })

  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary fallback={<Fallback />}>
        <ToThrowOrNotToThrow shouldThrow={false}>Content</ToThrowOrNotToThrow>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

function Fallback() {
  return <div>Error occurred</div>
}

function ToThrowOrNotToThrow({ children, shouldThrow }: { children: ReactNode; shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <>{children}</>
}
