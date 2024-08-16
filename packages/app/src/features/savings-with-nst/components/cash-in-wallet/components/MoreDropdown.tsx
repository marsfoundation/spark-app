import { Token } from '@/domain/types/Token'
import { UpgradeInfo } from '@/features/savings-with-nst/logic/useSavings'
import ArrowUpRightIcon from '@/ui/assets/arrow-up-right.svg?react'
import DocumentSketchIcon from '@/ui/assets/document-sketch.svg?react'
import DowngradeIcon from '@/ui/assets/downgrade.svg?react'
import MoreIcon from '@/ui/assets/more-icon.svg?react'
import { Button } from '@/ui/atoms/button/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { testIds } from '@/ui/utils/testIds'

export interface MoreDropdownProps {
  token: Token
  disabled?: boolean
  upgradeInfo?: UpgradeInfo
}

export function MoreDropdown({ token, upgradeInfo, disabled }: MoreDropdownProps) {
  return (
    <DropdownWrapper disabled={disabled}>
      {upgradeInfo?.NSTSymbol === token.symbol && (
        <>
          <DropdownItem onClick={upgradeInfo.openNstToDaiDowngradeDialog}>
            <DowngradeIcon className="h-4 w-4" />
            Downgrade to {upgradeInfo.daiSymbol}
          </DropdownItem>
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownItem>
        <DocumentSketchIcon className="h-4 w-4" />
        Learn more
        <ArrowUpRightIcon className="ml-auto h-4 w-4" />
      </DropdownItem>
    </DropdownWrapper>
  )
}

function DropdownWrapper({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="px-2"
          disabled={disabled}
          data-testid={testIds.savings.cashInWallet.moreDropdown}
        >
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}

function DropdownItem({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <DropdownMenuItem
      className="flex cursor-pointer items-center gap-2 font-medium text-basics-dark-grey"
      onClick={onClick}
    >
      {children}
    </DropdownMenuItem>
  )
}
