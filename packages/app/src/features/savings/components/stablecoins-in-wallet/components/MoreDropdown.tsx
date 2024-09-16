import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { MigrationInfo } from '@/features/savings/logic/makeMigrationInfo'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
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
import { LinkDecorator } from '@/ui/atoms/link-decorator/LinkDecorator'
import { testIds } from '@/ui/utils/testIds'

export interface MoreDropdownProps {
  token: Token
  disabled?: boolean
  migrationInfo?: MigrationInfo
  blockExplorerLink: string | undefined
  balance?: NormalizedUnitNumber
}

export function MoreDropdown({ token, blockExplorerLink, migrationInfo, disabled, balance }: MoreDropdownProps) {
  return (
    <DropdownWrapper disabled={disabled}>
      {migrationInfo?.usdsSymbol === token.symbol && (
        <>
          <DropdownItem
            onClick={migrationInfo.openUsdsToDaiDowngradeDialog}
            disabled={balance?.eq(0)}
            data-testid={testIds.savings.stablecoinsInWallet.downgradeUsdsToDai}
          >
            <DowngradeIcon className="h-4 w-4" />
            Downgrade to {migrationInfo.daiSymbol}
          </DropdownItem>
          <DropdownMenuSeparator />
        </>
      )}
      {blockExplorerLink && (
        <LinkDecorator to={blockExplorerLink} external>
          <DropdownItem>
            <DocumentSketchIcon className="h-4 w-4" />
            View contract
            <BoxArrowTopRight className="ml-auto h-4 w-4" />
          </DropdownItem>
        </LinkDecorator>
      )}
    </DropdownWrapper>
  )
}

function DropdownWrapper({ children, disabled }: { children?: React.ReactNode; disabled?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="px-2"
          disabled={disabled}
          data-testid={testIds.savings.stablecoinsInWallet.moreDropdown}
        >
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}

function DropdownItem({
  children,
  onClick,
  disabled,
  'data-testid': dataTestId,
}: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; 'data-testid'?: string }) {
  return (
    <DropdownMenuItem
      className="flex cursor-pointer items-center gap-2 font-medium text-basics-dark-grey"
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
    >
      {children}
    </DropdownMenuItem>
  )
}
