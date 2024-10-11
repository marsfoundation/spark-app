import { useState } from 'react'

import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { useBannerVisibility } from '@/domain/state/bannersVisibility'
import { Navbar } from '@/features/navbar/Navbar'
import { cn } from '@/ui/utils/style'
import { useElementSize } from '@/ui/utils/useElementSize'
import {
  SKY_MIGRATION_TOP_BANNER_ID,
  SkyMigrationTopBanner,
} from '../../atoms/sky-migration-top-banner/SkyMigrationTopBanner'
import { PageNotSupportedOverlay } from './components/PageNotSupportedOverlay'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuCollapsed, setMobileMenuCollapsed] = useState(true)
  const { pageSupported, pageName } = usePageChainId()
  const { handleCloseBanner, showBanner } = useBannerVisibility(SKY_MIGRATION_TOP_BANNER_ID)
  const [navbarContainerRef, { height: navbarContainerHeight }] = useElementSize()

  return (
    <div className={cn('flex min-h-screen flex-col', mobileMenuCollapsed && 'pb-5')}>
      <div className={cn(!pageSupported && 'absolute z-50 w-full')} ref={navbarContainerRef}>
        {import.meta.env.VITE_FEATURE_TOP_BANNER === '1' && showBanner && (
          <SkyMigrationTopBanner onClose={handleCloseBanner} />
        )}
        <Navbar mobileMenuCollapsed={mobileMenuCollapsed} setMobileMenuCollapsed={setMobileMenuCollapsed} />
      </div>
      {!pageSupported && <PageNotSupportedOverlay pageName={pageName} />}
      <main
        className={cn('isolate flex w-full grow flex-col', !mobileMenuCollapsed && 'hidden lg:flex')}
        style={{ marginTop: pageSupported ? 0 : navbarContainerHeight }}
      >
        {children}
      </main>
    </div>
  )
}
