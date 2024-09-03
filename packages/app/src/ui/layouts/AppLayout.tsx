import { cx } from 'class-variance-authority'
import { useState } from 'react'

import { useBanner } from '@/domain/state/banners'
import { Navbar } from '@/features/navbar/Navbar'
import { cn } from '@/ui/utils/style'
import { SKY_MIGRATION_BANNER_ID, SkyMigrationBanner } from '../atoms/sky-migration-banner/SkyMigrationBanner'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuCollapsed, setMobileMenuCollapsed] = useState(true)
  const { handleCloseBanner, showBanner } = useBanner(SKY_MIGRATION_BANNER_ID)

  return (
    <div className={cn('flex min-h-screen flex-col', mobileMenuCollapsed && 'pb-5')}>
      {import.meta.env.VITE_FEATURE_TOP_BANNER === '1' && showBanner && (
        <SkyMigrationBanner onClose={handleCloseBanner} />
      )}
      <Navbar mobileMenuCollapsed={mobileMenuCollapsed} setMobileMenuCollapsed={setMobileMenuCollapsed} />
      <div className={cx('flex w-full grow flex-col', !mobileMenuCollapsed && 'hidden lg:flex')}>{children}</div>
    </div>
  )
}
