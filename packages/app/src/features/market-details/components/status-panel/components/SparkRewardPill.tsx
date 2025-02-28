import { formatPercentage } from '@/domain/common/format'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getTokenColor, getTokenImage } from '@/ui/assets'
import { Percentage } from '@marsfoundation/common-universal'
export interface SparkRewardPillProps {
  rewardTokenSymbol: TokenSymbol
  apy?: Percentage
}

export function SparkRewardPill({ rewardTokenSymbol, apy }: SparkRewardPillProps) {
  const tokenColor = getTokenColor(rewardTokenSymbol)

  return (
    <div className="flex items-center gap-1.5 rounded-xxs border px-1.5 py-1" style={{ borderColor: tokenColor }}>
      <img src={getTokenImage(rewardTokenSymbol)} alt={rewardTokenSymbol} className="size-3" />
      <div className="typography-button-2" style={{ color: tokenColor }}>
        {formatPercentage(apy)}
      </div>
    </div>
  )
}
