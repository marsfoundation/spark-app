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
    <div className="flex flex-col items-center">
      <div className="flex items-baseline gap-2">
        <img src={getTokenImage(rewardToken.symbol)} className="h-8 w-8" />
        <div
          className="flex flex-row items-baseline justify-center tabular-nums"
          data-testid={testIds.farmDetails.activeFarmInfoPanel.rewards}
        >
          <div className="typography-heading-2 sm:typography-heading-3 xl:typography-heading-1 text-primary">
            {getWholePart(currentReward)}
          </div>
          <div className="typography-heading-5 sm:typography-heading-5 xl:typography-heading-4 text-primary">
            {getFractionalPart(currentReward, precision)}
          </div>
        </div>
      </div>
      {rewardToken.unitPriceUsd.gt(0) && (
        <div className="typography-label-5 text-secondary">
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
