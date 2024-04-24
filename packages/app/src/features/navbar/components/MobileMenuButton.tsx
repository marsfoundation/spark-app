import { assets } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'

export interface MobileMenuButtonProps {
  mobileMenuCollapsed: boolean
  setMobileMenuCollapsed: (collapsed: boolean) => void
}

export function MobileMenuButton({ mobileMenuCollapsed, setMobileMenuCollapsed }: MobileMenuButtonProps) {
  return (
    <Button
      variant="icon"
      data-testid="mobile-menu-button"
      className="lg:hidden"
      onClick={() => {
        setMobileMenuCollapsed(!mobileMenuCollapsed)
      }}
    >
      <span className="sr-only">Open main menu</span>
      <img src={mobileMenuCollapsed ? assets.menu : assets.close} className="h-8 w-8" />
    </Button>
  )
}
