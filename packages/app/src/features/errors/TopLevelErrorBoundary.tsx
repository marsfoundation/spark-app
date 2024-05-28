import { ErrorBoundary } from '@sentry/react'
import { ReactNode } from 'react'

import { ErrorFallback } from './ErrorFallback'

interface TopLevelErrorBoundary {
  children: ReactNode
}

export function TopLevelErrorBoundary({ children }: TopLevelErrorBoundary) {
  return (
    <ErrorBoundary fallback={<ErrorFallback onReload={() => window.location.reload()} fullScreen />}>
      {children}
    </ErrorBoundary>
  )
}
