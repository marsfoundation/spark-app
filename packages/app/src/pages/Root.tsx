import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'

import { ComplianceContainer } from '@/features/compliance/ComplianceContainer'
import { DialogDispatcherContainer } from '@/features/dialogs/dispatcher/DialogDispatcherContainer'
import { RouterErrorFallback } from '@/features/errors/RouterErrorFallback'
import { AppLayout } from '@/ui/layouts/AppLayout'
import { FallbackLayout } from '@/ui/layouts/FallbackLayout'

export function RootRoute() {
  return (
    <Suspense fallback={<FallbackLayout />}>
      <AppLayout>
        <ErrorBoundary fallback={<RouterErrorFallback />}>
          <Outlet />
          <DialogDispatcherContainer />
          <ComplianceContainer />
        </ErrorBoundary>
      </AppLayout>
    </Suspense>
  )
}
