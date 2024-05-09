import { assets } from '@/ui/assets'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'

import { AirdropInfo } from '../../types'
import { formatCompact } from '../../utils/formatCompact'
import { NavbarActionWrapper } from '../NavbarActionWrapper'
import { AirdropDetails } from './AirdropDetails'

export function AirdropBadge({ amount, isLoading }: AirdropInfo) {
  return (
    <NavbarActionWrapper label="Airdrop info">
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="to-basics-grey/50 from-product-orange rounded-[9px] bg-gradient-to-t p-[1px]">
            <div className="flex h-11 items-center gap-1.5 rounded-lg bg-white p-2 lg:h-[38px]">
              <img src={assets.sparkIcon} className="h-7 lg:h-6" />
              {isLoading ? (
                <Skeleton className="h-5 w-7" />
              ) : (
                <div className="font-semibold">{formatCompact(amount)}</div>
              )}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContentLong align="start" className="p-0">
          <AirdropDetails amount={amount} isLoading={isLoading} />
        </TooltipContentLong>
      </Tooltip>
    </NavbarActionWrapper>
  )
}
