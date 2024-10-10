import { cx } from 'class-variance-authority'
import { useEffect, useState } from 'react'

import { usePageChainId } from '@/domain/hooks/usePageChainId'
import { useBannerVisibility } from '@/domain/state/bannersVisibility'
import { Navbar } from '@/features/navbar/Navbar'
import { cn } from '@/ui/utils/style'
import { useVisibleHeight } from '@/ui/utils/useVisibleHeight'
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
  const [mainRef, { height: mainHeight, refresh: refreshMainHeight }] = useVisibleHeight()

  // fixes weird bug where height is not refreshed on mobile when banner is closed
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    refreshMainHeight()
  }, [showBanner, refreshMainHeight])

  return (
    <div className={cn('flex min-h-screen flex-col', mobileMenuCollapsed && 'pb-5')}>
      {import.meta.env.VITE_FEATURE_TOP_BANNER === '1' && showBanner && (
        <SkyMigrationTopBanner onClose={handleCloseBanner} />
      )}
      <Navbar mobileMenuCollapsed={mobileMenuCollapsed} setMobileMenuCollapsed={setMobileMenuCollapsed} />
      <main className={cx('isolate flex w-full grow flex-col', !mobileMenuCollapsed && 'hidden lg:flex')} ref={mainRef}>
        {!pageSupported && <PageNotSupportedOverlay contentHeight={mainHeight} pageName={pageName} />}
        {children}
      </main>
    </div>
  )
}
