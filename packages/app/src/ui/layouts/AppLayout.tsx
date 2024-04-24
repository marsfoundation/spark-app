import { cx } from 'class-variance-authority'
import { useState } from 'react'

import { Navbar } from '@/features/navbar/Navbar'
import { cn } from '@/ui/utils/style'

import { TopBanner } from '../atoms/top-banner/TopBanner'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuCollapsed, setMobileMenuCollapsed] = useState(true)

  return (
    <div className={cn('flex min-h-screen flex-col', mobileMenuCollapsed && 'pb-5')}>
      {import.meta.env.VITE_FEATURE_TOP_BANNER === '1' && <TopBanner />}
      <Navbar mobileMenuCollapsed={mobileMenuCollapsed} setMobileMenuCollapsed={setMobileMenuCollapsed} />
      <div className={cx('flex w-full grow flex-col', !mobileMenuCollapsed && 'hidden lg:flex')}>{children}</div>
    </div>
  )
}
