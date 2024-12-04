import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getTokenImage } from '@/ui/assets'
import { Tooltip, TooltipContent, TooltipContentLayout, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { TokenPill } from '../token-pill/TokenPill'

interface RewardBadgeProps {
  incentivizedReserve: TokenSymbol
  rewardToken: TokenSymbol
  rewardApr: Percentage
  'data-testid'?: string
}

export function RewardBadge({
  incentivizedReserve,
  rewardToken,
  rewardApr,
  'data-testid': dataTestId,
}: RewardBadgeProps) {
  const tokenImage = getTokenImage(rewardToken)
  const formattedRewardApr = formatPercentage(rewardApr)

  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger>
        <TokenPill tokenSymbol={rewardToken} data-testid={dataTestId} />
      </TooltipTrigger>
      <TooltipContent variant="long">
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
      </TooltipContent>
    </Tooltip>
  )
}
