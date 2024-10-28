import { Button } from '@/ui/atoms/button/Button'
import MenuIcon from '@/ui/assets/menu.svg?react'
import CloseIcon from '@/ui/assets/close.svg?react'

// Then in the component:

export interface MobileMenuButtonProps {
  mobileMenuCollapsed: boolean
  setMobileMenuCollapsed: (collapsed: boolean) => void
}

export function MobileMenuButton({ mobileMenuCollapsed, setMobileMenuCollapsed }: MobileMenuButtonProps) {
  return (
    <Button
      variant="icon"
      data-testid="mobile-menu-button"
      className="text-white/70 lg:hidden hover:text-white"
      onClick={() => {
        setMobileMenuCollapsed(!mobileMenuCollapsed)
      }}
    >
      <span className="sr-only">Open main menu</span>
      {mobileMenuCollapsed ? <MenuIcon className="h-7 w-7" /> : <CloseIcon className="h-8 w-8" />}
    </Button>
  )
}
