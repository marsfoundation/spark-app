import { Farm } from '@/domain/farms/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { getTokenImage } from '@/ui/assets'
import { testIds } from '@/ui/utils/testIds'
import { getFractionalPart, getWholePart } from '@/utils/bigNumber'
import { useTimestamp } from '@/utils/useTimestamp'
import { calculateReward } from '../../logic/calculateReward'

const STEP_IN_MS = 50

export interface GrowingRewardProps {
  farm: Farm
}

export function GrowingReward({ farm }: GrowingRewardProps) {
  const { rewardToken, earned, staked, rewardRate, earnedTimestamp, periodFinish, totalSupply } = farm
  const { timestampInMs } = useTimestamp({
    refreshIntervalInMs: rewardRate.gt(0) && totalSupply.gt(0) ? STEP_IN_MS : undefined,
  })

  const currentReward = calculateReward({
    earned,
    staked,
    rewardRate,
    earnedTimestamp,
    periodFinish,
    timestampInMs,
    totalSupply,
  })
  const rewardIn1Step = calculateReward({
    earned,
    staked,
    rewardRate,
    earnedTimestamp,
    periodFinish,
    timestampInMs: timestampInMs + STEP_IN_MS,
    totalSupply,
  })
  const precision = calculatePrecision({ currentReward, rewardIn1Step })

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <img src={getTokenImage(rewardToken.symbol)} className="h-8 w-8" />
        <div
          className="flex flex-row items-end justify-center slashed-zero tabular-nums"
          data-testid={testIds.farmDetails.activeFarmInfoPanel.rewards}
        >
          <div className="font-semibold text-3xl md:text-5xl">{getWholePart(currentReward)}</div>
          <div className="font-semibold text-lg md:text-2xl">{getFractionalPart(currentReward, precision)}</div>
        </div>
      </div>
      <div className="font-semibold text-basics-dark-grey text-xs tracking-wide">
        &#8776;
        <span data-testid={testIds.farmDetails.activeFarmInfoPanel.staked}>{rewardToken.formatUSD(currentReward)}</span>
      </div>
    </div>
  )
}

interface CalculatePrecisionParams {
  currentReward: NormalizedUnitNumber
  rewardIn1Step: NormalizedUnitNumber
}
function calculatePrecision({ currentReward, rewardIn1Step }: CalculatePrecisionParams): number {
  const precision = rewardIn1Step.minus(currentReward).lt(1e-12)
    ? 0
    : -Math.floor(Math.log10(rewardIn1Step.minus(currentReward).toNumber()))

  return Math.max(precision, 2)
}
