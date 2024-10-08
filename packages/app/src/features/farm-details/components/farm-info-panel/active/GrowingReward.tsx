import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { getTokenImage } from '@/ui/assets'
import { testIds } from '@/ui/utils/testIds'
import { getFractionalPart, getWholePart } from '@/utils/bigNumber'
import { useTimestamp } from '@/utils/useTimestamp'

const STEP_IN_MS = 50

export interface GrowingRewardProps {
  rewardToken: Token
  calculateReward: (timestampInMs: number) => NormalizedUnitNumber
  refreshIntervalInMs: number | undefined
}

export function GrowingReward({ rewardToken, calculateReward, refreshIntervalInMs }: GrowingRewardProps) {
  const { timestampInMs } = useTimestamp({
    refreshIntervalInMs,
  })

  const currentReward = calculateReward(timestampInMs)
  const rewardIn1Step = calculateReward(timestampInMs + STEP_IN_MS)
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
      {rewardToken.unitPriceUsd.gt(0) && (
        <div className="font-semibold text-basics-dark-grey text-xs tracking-wide">
          &#8776;
          <span data-testid={testIds.farmDetails.activeFarmInfoPanel.rewardsUsd}>
            {rewardToken.formatUSD(currentReward)}
          </span>
        </div>
      )}
    </div>
  )
}

interface CalculatePrecisionParams {
  currentReward: NormalizedUnitNumber
  rewardIn1Step: NormalizedUnitNumber
}
function calculatePrecision({ currentReward, rewardIn1Step }: CalculatePrecisionParams): number {
  const precision = rewardIn1Step.minus(currentReward).lt(1e-12)
    ? 6
    : -Math.floor(Math.log10(rewardIn1Step.minus(currentReward).toNumber()))

  return Math.max(precision, 2)
}
