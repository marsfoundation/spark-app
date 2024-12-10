import { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { ComplianceContainer } from '@/features/compliance/ComplianceContainer'
import { Debug } from '@/features/debug'
import { DialogDispatcherContainer } from '@/features/dialogs/dispatcher/DialogDispatcherContainer'
import { ErrorBoundary } from '@/features/errors'
import { ErrorFallback } from '@/features/errors/ErrorFallback'
import { FallbackLayout } from '@/ui/layouts/FallbackLayout'
import { AppLayout } from '@/ui/layouts/app-layout/AppLayout'
import { useConfig } from 'wagmi'
import { trackUserAddress } from '@/domain/analytics/mixpanel.ts'
import { watchAccount } from 'wagmi/actions'
import { useWalletType } from '@/domain/hooks/useWalletType.ts'
import { CheckedAddress } from '@marsfoundation/common-universal'

export function RootRoute() {
  const config = useConfig()
  const walletType = useWalletType()
  useEffect(() => {
    return watchAccount(config, {
      onChange({ address }) {
        if (!address) {
          return
        }

        trackUserAddress(CheckedAddress(address), walletType!)
      },
    })
  }, [config, walletType])

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
