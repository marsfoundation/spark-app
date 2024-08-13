import { Token } from '@/domain/types/Token'
import { DaiNstUpgradeInfo } from '@/features/savings-with-nst/logic/useSavings'
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

export interface MoreDropdownProps {
  token: Token
  disabled?: boolean
  daiNstUpgradeInfo?: DaiNstUpgradeInfo
}

export function MoreDropdown({ token, daiNstUpgradeInfo, disabled }: MoreDropdownProps) {
  return (
    <DropdownWrapper disabled={disabled}>
      {daiNstUpgradeInfo?.nstSymbol === token.symbol && (
        <>
          <DropdownItem>
            <DowngradeIcon className="h-4 w-4" />
            Downgrade to {daiNstUpgradeInfo.daiSymbol}
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
        <Button variant="secondary" size="sm" className="px-2" disabled={disabled}>
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}

function DropdownItem({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenuItem className="flex cursor-pointer items-center gap-2 font-medium text-basics-dark-grey">
      {children}
    </DropdownMenuItem>
  )
}
