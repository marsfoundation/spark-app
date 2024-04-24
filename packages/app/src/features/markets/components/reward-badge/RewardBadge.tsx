import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getTokenImage } from '@/ui/assets'
import { Tooltip, TooltipContentLong, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { TooltipContentLayout } from '@/ui/atoms/tooltip/TooltipContentLayout'

import { TokenPill } from '../token-pill/TokenPill'

interface RewardBadgeProps {
  incentivizedReserve: TokenSymbol
  rewardToken: TokenSymbol
  rewardApr: Percentage
}

export function RewardBadge({ incentivizedReserve, rewardToken, rewardApr }: RewardBadgeProps) {
  const tokenImage = getTokenImage(rewardToken)
  const formattedRewardApr = formatPercentage(rewardApr)

  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger>
        <TokenPill tokenSymbol={rewardToken} />
      </TooltipTrigger>
      <TooltipContentLong>
        <TooltipContentLayout>
          <TooltipContentLayout.Header>
            {tokenImage && <TooltipContentLayout.Icon src={tokenImage} />}
            <TooltipContentLayout.Title>
              {rewardToken} - {formattedRewardApr} APR
            </TooltipContentLayout.Title>
          </TooltipContentLayout.Header>

          <TooltipContentLayout.Body>
            Participating in the {incentivizedReserve} reserve gives annualized rewards.
          </TooltipContentLayout.Body>
        </TooltipContentLayout>
      </TooltipContentLong>
    </Tooltip>
  )
}
