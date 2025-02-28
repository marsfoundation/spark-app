import { SparkReward } from '@/features/market-details/types'
import { getTokenColor, getTokenImage } from '@/ui/assets'
import { assets } from '@/ui/assets'
import { Info } from '@/ui/molecules/info/Info'
import { Percentage, raise } from '@marsfoundation/common-universal'

export interface SparkRewardsBadgeProps {
  sparkRewards: SparkReward[]
}

export function SparkRewardsBadge({ sparkRewards }: SparkRewardsBadgeProps) {
  if (sparkRewards.length === 0) {
    return null
  }

  if (sparkRewards.length > 1) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-gradient-spark-rewards p-2">
        <img src={assets.page.sparkRewardsCircle} alt="Spark Rewards" className="size-4" />
        <div className="flex items-center gap-1">
          <div className="typography-label-4 text-primary">Eligible for rewards</div>
          <Info>Eligble for rewards</Info>
        </div>
      </div>
    )
  }

  const rewardTokenSymbol = sparkRewards[0]?.rewardTokenSymbol ?? raise('No reward token symbol')

  const bgColor = getTokenColor(rewardTokenSymbol, { alpha: Percentage(0.1) })
  const rewardIcon = getTokenImage(rewardTokenSymbol)

  return (
    <div className="flex items-center gap-1.5 rounded-full p-2" style={{ backgroundColor: bgColor }}>
      <img src={rewardIcon} alt={rewardTokenSymbol} className="size-4" />
      <div className="flex items-center gap-1">
        <div className="typography-label-4 text-primary">Eligble for {rewardTokenSymbol} rewards</div>
        <Info>Eligble for {rewardTokenSymbol} rewards</Info>
      </div>
    </div>
  )
}
