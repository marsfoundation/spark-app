import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { ComplianceContainer } from '@/features/compliance/ComplianceContainer'
import { DialogDispatcherContainer } from '@/features/dialogs/dispatcher/DialogDispatcherContainer'
import { AppLayout } from '@/ui/layouts/AppLayout'
import { FallbackLayout } from '@/ui/layouts/FallbackLayout'

export function RootRoute() {
  return (
    <Suspense fallback={<FallbackLayout />}>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <DialogDispatcherContainer />
      <ComplianceContainer />
    </Suspense>
  )
}
