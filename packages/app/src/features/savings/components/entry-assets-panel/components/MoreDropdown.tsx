import { Token } from '@/domain/types/Token'
import { MigrationInfo } from '@/features/savings/logic/makeMigrationInfo'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import DocumentSketchIcon from '@/ui/assets/document-sketch.svg?react'
import DowngradeIcon from '@/ui/assets/downgrade.svg?react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { IconButton } from '@/ui/atoms/icon-button/IconButton'
import { LinkDecorator } from '@/ui/atoms/link-decorator/LinkDecorator'
import { testIds } from '@/ui/utils/testIds'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { MoreVerticalIcon } from 'lucide-react'

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
        <IconButton
          variant="tertiary"
          size="s"
          disabled={disabled}
          data-testid={testIds.savings.stablecoinsInWallet.moreDropdown}
          icon={MoreVerticalIcon}
        />
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
      className="flex cursor-pointer items-center gap-2 text-secondary"
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
    >
      {children}
    </DropdownMenuItem>
  )
}
