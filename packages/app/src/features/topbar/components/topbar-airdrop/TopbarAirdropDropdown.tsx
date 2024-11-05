import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { SPK_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIcon,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { Link } from '@/ui/atoms/link/Link'
import { Button } from '@/ui/atoms/new/button/Button'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { links } from '@/ui/constants/links'
import { testIds } from '@/ui/utils/testIds'
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'
import { ExternalLinkIcon, LibraryIcon } from 'lucide-react'

export interface TopbarAirdropDropdownProps {
  amount?: NormalizedUnitNumber
  precision?: number
  isLoading?: boolean
  isGrowing?: boolean
  setEnableCounter?: (value: boolean) => void
}

export function TopbarAirdropDropdown({
  amount = NormalizedUnitNumber(0),
  precision = 0,
  isLoading,
  isGrowing = false,
  setEnableCounter,
}: TopbarAirdropDropdownProps) {
  return (
    <DropdownMenu onOpenChange={(open) => setEnableCounter?.(open)}>
      <DropdownMenuTrigger asChild>
        <Button size="m" variant="tertiary" data-testid={testIds.navbar.airdropBadge}>
          <img src={assets.sparkIcon} className="icon-sm" />
          {isLoading ? (
            <Skeleton className="h-5 w-7 rounded-sm" />
          ) : (
            <div data-chromatic="ignore">{SPK_MOCK_TOKEN.format(amount, { style: 'compact' })}</div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-1">
        <DropdownMenuGroup className="py-2">
          <DropdownMenuLabel>Spark Airdrop Tokens</DropdownMenuLabel>
          <DropdownMenuItem className="pointer-events-none py-2">
            <img src={assets.sparkIcon} className="icon-md" />
            {isLoading ? (
              <Skeleton className="h-6 w-10 rounded-sm" />
            ) : (
              <div className="typography-label-4" data-chromatic="ignore">
                {formatAirdropAmount({ amount, precision, isGrowing })} {SPK_MOCK_TOKEN.symbol}
              </div>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuItem className="!typography-body-6 pointer-events-none py-2 text-secondary">
            DAI borrowers with volatile assets and ETH depositors will be eligible for a future ⚡ SPK airdrop.
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem asChild>
          <Link to={links.docs.sparkAirdrop} external className="cursor-pointer">
            <DropdownMenuItemIcon icon={LibraryIcon} />
            Learn more
            <DropdownMenuItemIcon icon={ExternalLinkIcon} className="ml-auto" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export interface FormatAirdropAmountParams {
  amount: NormalizedUnitNumber
  precision: number
  isGrowing?: boolean
}

export function formatAirdropAmount({ amount, precision, isGrowing }: FormatAirdropAmountParams): string {
  if (isGrowing) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    })
    return formatter.format(amount.toNumber())
  }
  return SPK_MOCK_TOKEN.format(amount, { style: 'auto' })
}
