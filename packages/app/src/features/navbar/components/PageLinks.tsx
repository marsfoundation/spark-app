import { paths } from '@/config/paths'
import { cn } from '@/ui/utils/style'

import { SavingsInfoQueryResults } from '../types'
import { NavLink } from './nav-link/NavLink'

export interface PageLinksInfo {
  daiSymbol?: string
  usdsSymbol?: string
}

export interface PageLinksProps {
  mobileMenuCollapsed: boolean
  closeMobileMenu: () => void
  savingsInfo: SavingsInfoQueryResults | undefined
  pageLinksInfo: PageLinksInfo
}

export function PageLinks({ mobileMenuCollapsed, closeMobileMenu }: PageLinksProps) {
  function handleNavigate() {
    closeMobileMenu()
  }

  const links = [
    {
      to: paths.easyBorrow,
      label: 'Borrow',
      onClick: handleNavigate,
    },
    {
      to: paths.myPortfolio,
      label: 'My portfolio',
      onClick: handleNavigate,
    },
    {
      to: paths.markets,
      label: 'Markets',
      onClick: handleNavigate,
    },
  ]

  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-6 py-6 font-sans',
        'lg:flex lg:flex-row lg:justify-normal lg:py-0 lg:pt-0',
        mobileMenuCollapsed && 'hidden lg:flex',
      )}
    >
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} onClick={link.onClick}>
          {link.label}
        </NavLink>
      ))}
    </div>
  )
}
