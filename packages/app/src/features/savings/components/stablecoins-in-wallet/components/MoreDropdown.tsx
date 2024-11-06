import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { MigrationInfo } from '@/features/savings/logic/makeMigrationInfo'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import DocumentSketchIcon from '@/ui/assets/document-sketch.svg?react'
import DowngradeIcon from '@/ui/assets/downgrade.svg?react'
import MoreIcon from '@/ui/assets/more-icon.svg?react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIcon,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { LinkDecorator } from '@/ui/atoms/link-decorator/LinkDecorator'
import { IconButton } from '@/ui/atoms/new/icon-button/IconButton'
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
            <DropdownMenuItemIcon icon={DowngradeIcon} />
            Downgrade to {migrationInfo.daiSymbol}
          </DropdownItem>
          <DropdownMenuSeparator />
        </>
      )}
      {blockExplorerLink && (
        <LinkDecorator to={blockExplorerLink} external>
          <DropdownItem>
            <DropdownMenuItemIcon icon={DocumentSketchIcon} />
            View contract
            <DropdownMenuItemIcon icon={BoxArrowTopRight} />
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
        <IconButton
          variant="tertiary"
          size="s"
          disabled={disabled}
          data-testid={testIds.savings.stablecoinsInWallet.moreDropdown}
          icon={MoreIcon}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-1">
        {children}
      </DropdownMenuContent>
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
      className="flex cursor-pointer items-center gap-2 font-medium text-secondary focus:text-primary"
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
    >
      {children}
    </DropdownMenuItem>
  )
}
