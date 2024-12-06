import { Path, paths } from '@/config/paths'
import { SavingsAPYBadge } from '@/features/savings/components/navbar-item/SavingsAPYBadge'
import { SavingsInfoQueryResults } from '@/features/topbar/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { cn } from '@/ui/utils/style'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { TopbarButton } from './TopbarButton'
import { LINKS_DATA } from './constants'

export interface TopbarNavigationInfo {
  daiSymbol?: string
  usdsSymbol?: string
}

export interface TopbarNavigationProps {
  savingsInfo: SavingsInfoQueryResults | undefined
  blockedPages: Path[]
  borrowSubLinks: Array<{
    to: string
    label: string
  }>
  isBorrowSubLinkActive: boolean
}

export function TopbarNavigation({
  savingsInfo,
  blockedPages,
  borrowSubLinks,
  isBorrowSubLinkActive,
}: TopbarNavigationProps) {
  const [linksDropdownOpen, setLinksDropdownOpen] = useState(false)

  function handleNavigate() {
    setLinksDropdownOpen(false)
  }

  return (
    <div className="hidden gap-2 sm:flex">
      {!blockedPages.some((page) => page === 'savings') && ( // some instead of includes for better type inference
        <TopbarButton
          to={paths.savings}
          label={LINKS_DATA.savings.label}
          prefixIcon={LINKS_DATA.savings.icon}
          type="savings"
          postfixSlot={
            savingsInfo?.data || savingsInfo?.isLoading ? (
              <SavingsAPYBadge
                APY={savingsInfo.data?.apy}
                isLoading={savingsInfo.isLoading}
                className="hidden lg:inline-flex"
              />
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
            postfixSlot={
              <ChevronDown className={cn('transition-transform duration-300', linksDropdownOpen && 'rotate-180')} />
            }
            active={isBorrowSubLinkActive}
            highlighted={linksDropdownOpen}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-72 shadow-2xl" align="start">
          {borrowSubLinks.map((link) => (
            <DropdownMenuItem
              key={link.to}
              asChild
              className="cursor-pointer rounded-none border-b border-b-primary p-0 first:rounded-t-xs last:rounded-b-xs last:border-none"
            >
              <NavLink to={link.to} onClick={handleNavigate}>
                {({ isActive }) => (
                  <div
                    className={cn('relative w-full p-6 text-secondary hover:text-primary', isActive && 'text-primary')}
                  >
                    <div
                      className={cn(
                        // @note: one time use gradient
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
