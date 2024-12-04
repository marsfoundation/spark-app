import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { SPK_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/new/tooltip/Tooltip'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
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
          <button className="rounded-[9px] bg-gradient-to-t from-product-orange to-reskin-neutral-200 p-[1px]">
            <div className="flex h-11 items-center gap-1.5 rounded-lg bg-white p-2 lg:h-[38px]">
              <img src={assets.sparkIcon} className="h-7 lg:h-6" />
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
        <TooltipContent variant="long" align="start" className="p-0">
          <AirdropDetails amount={amount} precision={precision} isLoading={isLoading} isGrowing={isGrowing} />
        </TooltipContent>
      </Tooltip>
    </NavbarActionWrapper>
  )
}
