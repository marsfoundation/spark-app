import { Token } from '@/domain/types/Token'
import { UpgradeInfo } from '@/features/savings-with-nst/logic/useSavings'
import MoreIcon from '@/ui/assets/more-icon.svg?react'
import { Button } from '@/ui/atoms/button/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'

export interface MoreDropdownProps {
  token: Token
  upgradeInfo?: UpgradeInfo
}

export function MoreDropdown({ token, upgradeInfo }: MoreDropdownProps) {
  return (
    <DropdownWrapper>
      {upgradeInfo?.isUpgradable && token.symbol === upgradeInfo.upgradedToken && (
        <DropdownMenuItem>Downgrade to {upgradeInfo.tokenToUpgrade}</DropdownMenuItem>
      )}
      <DropdownMenuItem>Learn more</DropdownMenuItem>
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
