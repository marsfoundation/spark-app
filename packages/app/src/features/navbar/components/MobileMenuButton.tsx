import { IconButton } from '@/ui/atoms/new/icon-button/IconButton'
import { MenuIcon, XIcon } from 'lucide-react'

export interface MobileMenuButtonProps {
  mobileMenuCollapsed: boolean
  setMobileMenuCollapsed: (collapsed: boolean) => void
}

export function MobileMenuButton({ mobileMenuCollapsed, setMobileMenuCollapsed }: MobileMenuButtonProps) {
  return (
    <IconButton
      data-testid="mobile-menu-button"
      className="lg:hidden"
      onClick={() => {
        setMobileMenuCollapsed(!mobileMenuCollapsed)
      }}
      icon={mobileMenuCollapsed ? MenuIcon : XIcon}
    />
  )
}
