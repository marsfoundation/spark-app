import { SPK_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { testIds } from '@/ui/utils/testIds'

import { AirdropInfo } from '../../types'
import { NavbarActionWrapper } from '../NavbarActionWrapper'
import { AirdropDetails } from './AirdropDetails'

export function AirdropBadge({ amount, isLoading, isError }: AirdropInfo) {
  if (isError) {
    return null
  }

  return (
    <NavbarActionWrapper label="Airdrop info">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className='rounded-[9px] bg-gradient-to-t from-product-orange to-basics-grey/50 p-[1px]'
            data-testid={testIds.navbar.airdropBadge}
          >
            <div className="flex h-11 items-center gap-1.5 rounded-lg bg-white p-2 lg:h-[38px]">
              <img src={assets.sparkIcon} className="h-7 lg:h-6" />
              {isLoading ? (
                <Skeleton className="h-5 w-7" />
              ) : (
                <div className="font-semibold">{SPK_MOCK_TOKEN.format(amount, { style: 'compact' })}</div>
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
