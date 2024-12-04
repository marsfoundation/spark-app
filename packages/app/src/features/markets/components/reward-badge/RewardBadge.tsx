import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getTokenImage } from '@/ui/assets'
import {
  Tooltip,
  TooltipContent,
  TooltipContentBody,
  TooltipContentHeader,
  TooltipContentIcon,
  TooltipContentLayout,
  TooltipContentTitle,
  TooltipTrigger,
} from '@/ui/atoms/tooltip/Tooltip'
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
          <TooltipContentHeader>
            {tokenImage && <TooltipContentIcon src={tokenImage} />}
            <TooltipContentTitle>
              {rewardToken} - {formattedRewardApr} APR
            </TooltipContentTitle>
          </TooltipContentHeader>

          <TooltipContentBody>
            Participating in the {incentivizedReserve} reserve gives annualized rewards.
          </TooltipContentBody>
        </TooltipContentLayout>
      </TooltipContent>
    </Tooltip>
  )
}
