import { Link } from 'react-router-dom'

import { assets } from '@/ui/assets'
import { cn } from '@/ui/utils/style'
import { MobileMenuButton } from './components/MobileMenuButton'
import { NavbarActions } from './components/NavbarActions'
import { PageLinks } from './components/PageLinks'
import { useNavbar } from './logic/useNavbar'

export interface NavbarProps {
  mobileMenuCollapsed: boolean
  setMobileMenuCollapsed: (collapsed: boolean) => void
  className?: string
}

export function Navbar({ mobileMenuCollapsed, setMobileMenuCollapsed, className }: NavbarProps) {
  const { openSandboxDialog, savingsInfo, connectedWalletInfo, rewardsInfo, isSandboxEnabled, pageLinksInfo } =
    useNavbar()

  function closeMobileMenu() {
    setMobileMenuCollapsed(true)
  }

  return (
    <nav
      className={cn(
        'relative flex flex-col px-6',
        'lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-6',

        !mobileMenuCollapsed && 'h-full lg:h-auto',
        className,
      )}
    >
      <div className="flex h-20 shrink-0 flex-row items-center justify-between">
        <Link to="/">
          <img src={assets.lastLogo} alt="Spark logo" style={{ height: '1.875rem' }} />
        </Link>

        <MobileMenuButton mobileMenuCollapsed={mobileMenuCollapsed} setMobileMenuCollapsed={setMobileMenuCollapsed} />
      </div>

      <PageLinks
        closeMobileMenu={closeMobileMenu}
        mobileMenuCollapsed={mobileMenuCollapsed}
        savingsInfo={savingsInfo}
        pageLinksInfo={pageLinksInfo}
      />

      <NavbarActions
        mobileMenuCollapsed={mobileMenuCollapsed}
        openSandboxDialog={openSandboxDialog}
        connectedWalletInfo={connectedWalletInfo}
        rewardsInfo={rewardsInfo}
        isSandboxEnabled={isSandboxEnabled}
      />
    </nav>
  )
}
