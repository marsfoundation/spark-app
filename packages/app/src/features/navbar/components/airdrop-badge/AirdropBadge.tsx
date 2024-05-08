import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'

import { NavbarActionWrapper } from '../NavbarActionWrapper'

export interface AirdropBadgeProps {
  amount: NormalizedUnitNumber
}

export function AirdropBadge({ amount }: AirdropBadgeProps) {
  return (
    <NavbarActionWrapper label="Airdrop info">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="to-basics-grey/60 from-product-orange rounded-[9px] bg-gradient-to-t p-[1px]">
            <div className="flex h-11 items-center gap-1.5 rounded-lg bg-white p-2 lg:h-[38px]">
              <img src={assets.sparkIcon} className="h-7 lg:h-6" />
              <div className="font-semibold">{USD_MOCK_TOKEN.format(amount, { style: 'compact' })}</div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContentLong>Airdrop info</TooltipContentLong>
      </Tooltip>
    </NavbarActionWrapper>
  )
}
