import { ChevronDown } from 'lucide-react'

import { paths } from '@/config/paths'
import { SavingsAPYBadge } from '@/features/savings/components/navbar-item/SavingsAPYBadge'
import { cn } from '@/ui/utils/style'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/atoms/accordion/Accordion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { useBreakpoint } from '@/ui/utils/useBreakpoint'

import { Button } from '@/ui/atoms/button/Button'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SavingsInfoQueryResults } from '../types'
import { NavLink, NavLinkComponent } from './nav-link/NavLink'
import { NewPageBadge } from './new-page-badge/NewPageBadge'

export interface PageLinksInfo {
  daiSymbol: string
  USDSSymbol?: string
}

export interface PageLinksProps {
  mobileMenuCollapsed: boolean
  closeMobileMenu: () => void
  savingsInfo: SavingsInfoQueryResults | undefined
  blockedPages: (keyof typeof paths)[]
  pageLinksInfo: PageLinksInfo
}

export function PageLinks({
  mobileMenuCollapsed,
  closeMobileMenu,
  savingsInfo,
  blockedPages,
  pageLinksInfo,
}: PageLinksProps) {
  const [linksDropdownOpen, setLinksDropdownOpen] = useState(false)
  const isMobile = !useBreakpoint('lg')

  function handleNavigate() {
    setLinksDropdownOpen(false)
    closeMobileMenu()
  }

  const dropdownLinks = [
    {
      to: paths.easyBorrow,
      label: `Borrow ${pageLinksInfo.daiSymbol}${pageLinksInfo.USDSSymbol ? ` and ${pageLinksInfo.USDSSymbol}` : ''}`,
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
  const isLinkFromDropdownActive = dropdownLinks.some((link) => link.to === location.pathname)

  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-6 py-6',
        'lg:flex lg:flex-row lg:justify-evenly lg:gap-0 lg:py-0 lg:pt-0',
        'xl:ml-20 xl:justify-normal xl:gap-12',
        mobileMenuCollapsed && 'hidden lg:flex',
      )}
    >
      {isMobile ? (
        // TODO: fix accordion initial open state animation
        <Accordion type="single" collapsible className="pr-1">
          <AccordionItem value="borrow">
            <AccordionTrigger className="p-0">
              <Button variant="text" className="h-full p-0" asChild>
                <NavLinkComponent size="md">Borrow</NavLinkComponent>
              </Button>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              {dropdownLinks.map((link) => (
                <NavLink key={link.to} shady size="sm" to={link.to} onClick={link.onClick} className="block py-2">
                  {link.label}
                </NavLink>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <DropdownMenu open={linksDropdownOpen} onOpenChange={setLinksDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="text" className="relative h-full p-0">
              <NavLinkComponent
                shady
                selected={isLinkFromDropdownActive}
                postfix={
                  <ChevronDown
                    className={cn('h-6 w-6 shrink-0 text-primary lg:opacity-50', linksDropdownOpen && 'rotate-180')}
                  />
                }
              >
                Borrow
              </NavLinkComponent>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72" sideOffset={-6} align="start">
            {dropdownLinks.map((link) => (
              <DropdownMenuItem key={link.to} className="p-0">
                <NavLink variant="vertical" to={link.to} onClick={link.onClick} className="w-full">
                  {link.label}
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {!blockedPages.some((page) => page === 'savings') && ( // some instead of includes for better type inference
        <NavLink
          to={paths.savings}
          onClick={closeMobileMenu}
          postfix={
            savingsInfo?.data || savingsInfo?.isLoading ? (
              <SavingsAPYBadge APY={savingsInfo.data?.apy} isLoading={savingsInfo.isLoading} />
            ) : undefined
          }
        >
          Cash & Savings
        </NavLink>
      )}

      {import.meta.env.VITE_DEV_FARMS === '1' && (
        <NavLink to={paths.farms} onClick={closeMobileMenu} postfix={<NewPageBadge />}>
          Farms
        </NavLink>
      )}
    </div>
  )
}
