import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { NavbarActionWrapper } from '../NavbarActionWrapper'
import { RewardsDetails } from './RewardsDetails'
import { Reward } from './types'

export interface RewardsProps {
  rewards: Reward[]
  isLoading: boolean
}
export function RewardsBadge({ rewards, isLoading }: RewardsProps) {
  const totalClaimableReward = rewards.reduce(
    (acc, { token, amount }) => NormalizedUnitNumber(acc.plus(token.toUSD(amount))),
    NormalizedUnitNumber(0),
  )

  if (totalClaimableReward.isZero() && !isLoading) {
    return null
  }

  return (
    <NavbarActionWrapper label="Claim rewards">
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="rounded-[9px] border border-basics-grey p-[1px]">
            <div className="flex h-11 shrink items-center gap-1.5 rounded-lg bg-white p-2 lg:h-[38px]">
              <img src={assets.giftbox} alt="claim-rewards" />
              {isLoading ? (
                <Skeleton className="h-5 w-7" />
              ) : (
                <div className="font-semibold">{USD_MOCK_TOKEN.formatUSD(totalClaimableReward)}</div>
              )}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContentLong align="start" className="p-0">
          <RewardsDetails rewards={rewards} isLoading={isLoading} />
        </TooltipContentLong>
      </Tooltip>
    </NavbarActionWrapper>
  )
}
