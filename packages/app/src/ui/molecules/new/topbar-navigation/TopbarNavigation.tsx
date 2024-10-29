import { Path, paths } from '@/config/paths'
import { SavingsInfoQueryResults } from '@/features/navbar/types'
import { SavingsAPYBadge } from '@/features/savings/components/navbar-item/SavingsAPYBadge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { cn } from '@/ui/utils/style'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { NavLink, matchPath, useLocation } from 'react-router-dom'
import { TopbarButton } from './TopbarButton'
import { LINKS_DATA } from './constants'

export interface TopbarNavigationInfo {
  daiSymbol?: string
  usdsSymbol?: string
}

export interface TopbarNavigationProps {
  savingsInfo: SavingsInfoQueryResults | undefined
  blockedPages: Path[]
  topbarNavigationInfo: TopbarNavigationInfo
}

export function TopbarNavigation({ savingsInfo, blockedPages, topbarNavigationInfo }: TopbarNavigationProps) {
  const [linksDropdownOpen, setLinksDropdownOpen] = useState(false)

  function handleNavigate() {
    setLinksDropdownOpen(false)
  }

  const borrowSubLinks = [
    {
      to: paths.easyBorrow,
      label: `Borrow ${topbarNavigationInfo.daiSymbol ?? ''}${topbarNavigationInfo.usdsSymbol ? ` and ${topbarNavigationInfo.usdsSymbol}` : ''}`,
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

  const location = useLocation()
  const isBorrowSubLinkActive = borrowSubLinks.some((link) => matchPath(`${link.to}/*`, location.pathname))

  return (
    <div className="flex gap-2">
      {!blockedPages.some((page) => page === 'savings') && ( // some instead of includes for better type inference
        <TopbarButton
          to={paths.savings}
          label={LINKS_DATA.savings.label}
          prefixIcon={LINKS_DATA.savings.icon}
          type="savings"
          postfixSlot={
            savingsInfo?.data || savingsInfo?.isLoading ? (
              <SavingsAPYBadge APY={savingsInfo.data?.apy} isLoading={savingsInfo.isLoading} />
            ) : undefined
          }
        />
      )}

      <DropdownMenu open={linksDropdownOpen} onOpenChange={setLinksDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <TopbarButton
            label={LINKS_DATA.borrow.label}
            type="borrow"
            prefixIcon={LINKS_DATA.borrow.icon}
            postfixSlot={<ChevronDown className={cn(linksDropdownOpen && 'rotate-180')} />}
            active={isBorrowSubLinkActive}
            highlighted={linksDropdownOpen}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-72 shadow-2xl" align="start">
          {borrowSubLinks.map((link) => (
            <DropdownMenuItem
              key={link.to}
              asChild
              className="typography-label-4 cursor-pointer p-0 focus-visible:outline-none"
            >
              <NavLink to={link.to} onClick={link.onClick}>
                {({ isActive }) => (
                  <div
                    className={cn('relative w-full p-6 text-secondary hover:text-primary', isActive && 'text-primary')}
                  >
                    <div
                      className={cn(
                        // @note - pointless to put this into config if its one time use - need to talk with designers about gradients
                        'absolute top-0 bottom-0 left-0 hidden w-[3px] bg-gradient-to-br from-[#FFCD4D] to-[#FF895D] opacity-0',
                        isActive && 'block opacity-1',
                      )}
                    />
                    {link.label}
                  </div>
                )}
              </NavLink>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <TopbarButton to={paths.farms} type="farms" label={LINKS_DATA.farms.label} prefixIcon={LINKS_DATA.farms.icon} />
    </div>
  )
}
