import { formatPercentage } from '@/domain/common/format'
import { SparkReward } from '@/features/market-details/types'
import { getTokenColor, getTokenImage } from '@/ui/assets'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'

export function SparkRewardPill({ rewardTokenSymbol, longDescription, apy }: SparkReward) {
  const tokenColor = getTokenColor(rewardTokenSymbol)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="flex items-center justify-center gap-1.5 rounded-xxs border px-1.5 py-1"
          style={{ borderColor: tokenColor }}
        >
          <img src={getTokenImage(rewardTokenSymbol)} alt={rewardTokenSymbol} className="size-3" />
          {apy?.gt(0) && (
            <div className="typography-button-2" style={{ color: tokenColor }}>
              {formatPercentage(apy)}
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>{longDescription}</TooltipContent>
    </Tooltip>
  )
}
