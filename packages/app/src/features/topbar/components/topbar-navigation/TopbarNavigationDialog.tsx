import { paths } from '@/config/paths'
import { SavingsAPYBadge } from '@/features/savings/components/navbar-item/SavingsAPYBadge'
import { assets } from '@/ui/assets'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/atoms/accordion/Accordion'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/ui/atoms/dialog/Dialog'
import { IconButton } from '@/ui/atoms/icon-button/IconButton'
import { MenuItem } from '@/ui/atoms/menu-item/MenuItem'
import { cn } from '@/ui/utils/style'
import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { TopbarButton } from './TopbarButton'
import { TopbarNavigationProps } from './TopbarNavigation'
import { LINKS_DATA } from './constants'

export function TopbarNavigationDialog({
  savingsInfo,
  blockedPages,
  borrowSubLinks,
  isBorrowSubLinkActive,
}: TopbarNavigationProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  function closeDialog() {
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <IconButton variant="transparent" size="m" icon={ChevronDownIcon} className="w-10 sm:w-14" />
      </DialogTrigger>

      <DialogContent overlayVariant="default" contentVerticalPosition="bottom" className="p-0">
        <DialogTitle className="border-primary border-b p-5 pt-6">
          <img src={assets.brand.logoDark} alt="Spark logo" className="h-6" />
        </DialogTitle>

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
            onClick={closeDialog}
          />
        )}

        <div className="border-primary border-t" />

        <Accordion type="single" collapsible defaultValue={isBorrowSubLinkActive ? 'nav-accordion' : ''}>
          <AccordionItem value="nav-accordion">
            <AccordionTrigger className="w-full p-0 pr-5" role="none">
              <TopbarButton
                label={LINKS_DATA.borrow.label}
                type="borrow"
                prefixIcon={LINKS_DATA.borrow.icon}
                active={isBorrowSubLinkActive}
                className="w-full"
              />
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 px-12">
              {borrowSubLinks.map((link) => (
                <NavLink key={link.to} to={link.to}>
                  {({ isActive }) => (
                    <MenuItem
                      key={link.to}
                      className={cn('overflow-hidden border border-primary text-secondary', isActive && 'text-primary')}
                      onClick={closeDialog}
                    >
                      <div
                        className={cn(
                          // @note: one time use gradient
                          'absolute top-0 bottom-0 left-0 hidden w-1 bg-gradient-to-br from-[#FFCD4D] to-[#FF895D] opacity-0',
                          isActive && 'block opacity-1',
                        )}
                      />
                      {link.label}
                    </MenuItem>
                  )}
                </NavLink>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="border-primary border-t" />

        <TopbarButton
          to={paths.farms}
          type="farms"
          label={LINKS_DATA.farms.label}
          prefixIcon={LINKS_DATA.farms.icon}
          onClick={closeDialog}
        />
      </DialogContent>
    </Dialog>
  )
}
