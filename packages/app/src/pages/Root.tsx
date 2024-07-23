import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { ComplianceContainer } from '@/features/compliance/ComplianceContainer'
import { Debug } from '@/features/debug'
import { DialogDispatcherContainer } from '@/features/dialogs/dispatcher/DialogDispatcherContainer'
import { ErrorBoundary } from '@/features/errors'
import { ErrorFallback } from '@/features/errors/ErrorFallback'
import { AppLayout } from '@/ui/layouts/AppLayout'
import { FallbackLayout } from '@/ui/layouts/FallbackLayout'

export function RootRoute() {
  return (
    <Suspense fallback={<FallbackLayout />}>
      <AppLayout>
        <ErrorBoundary fallback={ErrorFallback}>
          <Outlet />
          <DialogDispatcherContainer />
          <ComplianceContainer />
        </ErrorBoundary>
        {import.meta.env.VITE_DEV_DEBUG === '1' && <Debug />}
      </AppLayout>
    </Suspense>
  )
}
