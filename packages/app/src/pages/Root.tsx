import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'

import { ComplianceContainer } from '@/features/compliance/ComplianceContainer'
import { DialogDispatcherContainer } from '@/features/dialogs/dispatcher/DialogDispatcherContainer'
import { ErrorContainer } from '@/features/errors/ErrorContainer'
import { AppLayout } from '@/ui/layouts/AppLayout'
import { FallbackLayout } from '@/ui/layouts/FallbackLayout'

export function RootRoute() {
  return (
    <ErrorBoundary FallbackComponent={ErrorContainer}>
      <Suspense fallback={<FallbackLayout />}>
        <AppLayout>
          <ErrorBoundary FallbackComponent={ErrorContainer}>
            <Outlet />
            <DialogDispatcherContainer />
            <ComplianceContainer />
          </ErrorBoundary>
        </AppLayout>
      </Suspense>
    </ErrorBoundary>
  )
}
