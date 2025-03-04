import { SparkReward } from '@/domain/spark-rewards/types'
import { InfoTile } from '../../info-tile/InfoTile'
import { SparkRewardPill } from './SparkRewardPill'

export interface SparkRewardsInfoTileProps {
  sparkRewards: SparkReward[]
}

export function SparkRewardsInfoTile({ sparkRewards }: SparkRewardsInfoTileProps) {
  if (sparkRewards.length === 0) {
    return null
  }

  return (
    <InfoTile>
      <InfoTile.Label>Rewards APY</InfoTile.Label>
      <InfoTile.Value>
        <div className="flex items-stretch gap-0.5 sm:flex-col">
          {sparkRewards.map((reward) => (
            <SparkRewardPill key={reward.rewardTokenSymbol} {...reward} />
          ))}
        </div>
      </InfoTile.Value>
    </InfoTile>
  )
}
