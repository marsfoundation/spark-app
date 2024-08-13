import { Token } from '@/domain/types/Token'
import { UpgradableDaiDetails } from '@/features/savings-with-nst/logic/useSavings'
import MoreIcon from '@/ui/assets/more-icon.svg?react'
import { Button } from '@/ui/atoms/button/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/ui/atoms/dropdown/DropdownMenu'

export interface MoreDropdownProps {
  token: Token
  upgradableDaiDetails: UpgradableDaiDetails
}

export function MoreDropdown({ token, upgradableDaiDetails }: MoreDropdownProps) {
  return (
    <DropdownWrapper>
      {upgradableDaiDetails.isUpgradable && token.symbol === upgradableDaiDetails.NSTSymbol && (
        <div>Downgrade to dai</div>
      )}
      <div>Learn more</div>
    </DropdownWrapper>
  )
}

function DropdownWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="px-2">
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}
