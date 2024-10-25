import { Link } from 'react-router-dom'

import { assets } from '@/ui/assets'
import { cn } from '@/ui/utils/style'
import { useBlockedPages } from '../compliance/logic/useBlockedPages'
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
  const {
    currentChain,
    supportedChains,
    openSelectNetworkDialog,
    openSandboxDialog,
    savingsInfo,
    connectedWalletInfo,
    airdropInfo,
    rewardsInfo,
    isSandboxEnabled,
    pageLinksInfo,
  } = useNavbar()

  const blockedPages = useBlockedPages()

  function closeMobileMenu() {
    setMobileMenuCollapsed(true)
  }

  return (
    <nav
      className={cn(
        'relative flex flex-col bg-white px-6 shadow-nav',
        'lg:grid lg:grid-cols-[auto_1fr_auto]',
        !mobileMenuCollapsed && 'h-full lg:h-auto',
        className,
      )}
    >
      <div className="-mr-4 flex h-20 shrink-0 flex-row items-center justify-between">
        <Link to="/">
          <img src={assets.sparkLogo} alt="Spark logo" style={{ height: '2.72rem' }} />
        </Link>

        <MobileMenuButton mobileMenuCollapsed={mobileMenuCollapsed} setMobileMenuCollapsed={setMobileMenuCollapsed} />
      </div>

      <PageLinks
        closeMobileMenu={closeMobileMenu}
        mobileMenuCollapsed={mobileMenuCollapsed}
        blockedPages={blockedPages}
        savingsInfo={savingsInfo}
        pageLinksInfo={pageLinksInfo}
      />

      <NavbarActions
        mobileMenuCollapsed={mobileMenuCollapsed}
        currentChain={currentChain}
        supportedChains={supportedChains}
        openSelectNetworkDialog={openSelectNetworkDialog}
        openSandboxDialog={openSandboxDialog}
        connectedWalletInfo={connectedWalletInfo}
        airdropInfo={airdropInfo}
        rewardsInfo={rewardsInfo}
        isSandboxEnabled={isSandboxEnabled}
      />
    </nav>
  )
}
