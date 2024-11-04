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
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { links } from '@/ui/constants/links'
import { cn } from '@/ui/utils/style'
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
        <button
          className={cn(
            'typography-label-4 inline-flex h-10 flex-nowrap items-center',
            'group gap-2 rounded-sm transition-colors',
            'shadow-xs focus-visible:outline-none focus-visible:ring-1',
            'bg-gradient-spark-secondary p-px focus-visible:ring-reskin-orange',
          )}
          data-testid={testIds.navbar.airdropBadge}
        >
          <div className="flex h-full items-center gap-1.5 rounded-[7px] bg-white p-2">
            <img src={assets.sparkIcon} className="icon-sm" />
            {isLoading ? (
              <Skeleton className="h-5 w-8 rounded-sm" />
            ) : (
              <div data-chromatic="ignore">{SPK_MOCK_TOKEN.format(amount, { style: 'compact' })}</div>
            )}
          </div>
        </button>
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

export function formatAirdropAmount({
  amount,
  precision,
  isGrowing,
}: Required<Pick<TopbarAirdropDropdownProps, 'amount' | 'isGrowing' | 'precision'>>): string {
  if (isGrowing) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    })
    return formatter.format(amount.toNumber())
  }
  return SPK_MOCK_TOKEN.format(amount, { style: 'auto' })
}
