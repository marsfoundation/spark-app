import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { testIds } from '@/ui/utils/testIds'
import { NavbarActionWrapper } from '../NavbarActionWrapper'
import { RewardsDetails } from './RewardsDetails'
import { Reward } from './types'

export interface RewardsProps {
  rewards: Reward[]
  onClaim: () => void
}
export function RewardsBadge({ rewards, onClaim }: RewardsProps) {
  const totalClaimableReward = rewards.reduce(
    (acc, { token, amount }) => NormalizedUnitNumber(acc.plus(token.toUSD(amount))),
    NormalizedUnitNumber(0),
  )

  if (totalClaimableReward.isZero()) {
    return null
  }

  return (
    <NavbarActionWrapper label="Claim rewards">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="rounded-[9px] border border-basics-grey p-[1px]"
            data-testid={testIds.navbar.rewards.badge}
          >
            <div className="flex h-11 shrink items-center gap-1.5 rounded-lg bg-white p-2 lg:h-[38px]">
              <img src={assets.giftbox} alt="claim-rewards" />
              <div className="font-semibold" data-testid={testIds.navbar.rewards.claimableRewards}>
                {USD_MOCK_TOKEN.formatUSD(totalClaimableReward, { compact: true })}
              </div>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContentLong align="start" className="p-0">
          <RewardsDetails rewards={rewards} onClaim={onClaim} />
        </TooltipContentLong>
      </Tooltip>
    </NavbarActionWrapper>
  )
}
