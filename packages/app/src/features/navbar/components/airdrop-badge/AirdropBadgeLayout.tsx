import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { SPK_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { testIds } from '@/ui/utils/testIds'
import { NavbarActionWrapper } from '../NavbarActionWrapper'
import { AirdropDetails } from './AirdropDetails'

interface AirdropBadgeLayoutProps {
  amount?: NormalizedUnitNumber
  precision?: number
  isLoading?: boolean
  isGrowing?: boolean
  setEnableCounter?: (value: boolean) => void
}
export function AirdropBadgeLayout({
  amount = NormalizedUnitNumber(0),
  precision = 0,
  isLoading,
  isGrowing,
  setEnableCounter,
}: AirdropBadgeLayoutProps) {
  return (
    <NavbarActionWrapper label="Airdrop info">
      <Tooltip onOpenChange={(open) => setEnableCounter?.(open)}>
        <TooltipTrigger asChild>
          <button
            className="rounded-[18px] bg-gradient-to-t from-product-orange to-basics-grey/50 p-[1px]"
            data-testid={testIds.navbar.airdropBadge}
          >
            <div className="flex h-11 items-center gap-1.5 rounded-lg bg-black p-2 lg:h-[38px]">
              <img src={assets.lastLogo} className="h-7 lg:h-6" />
              {isLoading ? (
                <Skeleton className="h-5 w-7" />
              ) : (
                <div className="font-semibold" data-chromatic="ignore">
                  {SPK_MOCK_TOKEN.format(amount, { style: 'compact' })}
                </div>
              )}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContentLong align="start" className="p-0">
          <AirdropDetails amount={amount} precision={precision} isLoading={isLoading} isGrowing={isGrowing} />
        </TooltipContentLong>
      </Tooltip>
    </NavbarActionWrapper>
  )
}
