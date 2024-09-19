import { Farm } from '@/domain/farms/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { getTokenImage } from '@/ui/assets'
import { getFractionalPart, getWholePart } from '@/utils/bigNumber'
import { useTimestamp } from '@/utils/useTimestamp'
import BigNumber from 'bignumber.js'

const STEP_IN_MS = 50

export interface EarnedBalanceProps {
  farm: Farm
}

export function EarnedBalance({ farm }: EarnedBalanceProps) {
  const { rewardToken, earned, staked, rewardRate, earnedTimestamp, periodFinish, totalSupply } = farm
  const { timestampInMs } = useTimestamp({
    refreshIntervalInMs: rewardRate.gt(0) && totalSupply.gt(0) ? STEP_IN_MS : undefined,
  })

  const currentEarned = calculateEarned({
    earned,
    staked,
    rewardRate,
    earnedTimestamp,
    periodFinish,
    timestampInMs,
    totalSupply,
  })
  const earnedIn1Step = calculateEarned({
    earned,
    staked,
    rewardRate,
    earnedTimestamp,
    periodFinish,
    timestampInMs: timestampInMs + STEP_IN_MS,
    totalSupply,
  })
  const precision = calculatePrecision({ currentEarned, earnedIn1Step })

  return (
    <div className="flex items-center gap-2">
      <img src={getTokenImage(rewardToken.symbol)} className="h-8 w-8" />
      <div className="flex flex-row items-end justify-center slashed-zero tabular-nums">
        <div className="font-semibold text-3xl md:text-5xl">{getWholePart(currentEarned)}</div>
        <div className="font-semibold text-lg md:text-2xl">{getFractionalPart(currentEarned, precision)}</div>
      </div>
    </div>
  )
}

interface CalculateEarnedParams {
  earned: NormalizedUnitNumber
  staked: NormalizedUnitNumber
  rewardRate: NormalizedUnitNumber
  earnedTimestamp: number
  periodFinish: number
  timestampInMs: number
  totalSupply: NormalizedUnitNumber
}
function calculateEarned({
  earned,
  staked,
  rewardRate,
  earnedTimestamp,
  periodFinish,
  timestampInMs,
  totalSupply,
}: CalculateEarnedParams): NormalizedUnitNumber {
  if (totalSupply.isZero()) {
    return earned
  }

  const periodFinishInMs = periodFinish * 1000
  const earnedTimestampInMs = earnedTimestamp * 1000

  const timeDiff = ((timestampInMs > periodFinishInMs ? periodFinishInMs : timestampInMs) - earnedTimestampInMs) / 1000
  const accruedEarned = staked.multipliedBy(rewardRate).multipliedBy(BigNumber.max(timeDiff, 0)).dividedBy(totalSupply)
  const earnedInTotal = NormalizedUnitNumber(earned.plus(accruedEarned))

  return earnedInTotal
}

interface CalculatePrecisionParams {
  currentEarned: NormalizedUnitNumber
  earnedIn1Step: NormalizedUnitNumber
}
function calculatePrecision({ currentEarned, earnedIn1Step }: CalculatePrecisionParams): number {
  const precision = earnedIn1Step.minus(currentEarned).lt(1e-12)
    ? 0
    : -Math.floor(Math.log10(earnedIn1Step.minus(currentEarned).toNumber())) - 1

  return Math.max(precision, 2)
}
