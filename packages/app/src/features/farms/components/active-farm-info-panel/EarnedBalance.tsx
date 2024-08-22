import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { getTokenImage } from '@/ui/assets'
import { useTimestamp } from '@/utils/useTimestamp'
import BigNumber from 'bignumber.js'
import { FarmExtendedInfo } from '../../types'

const STEP_IN_MS = 50

export interface EarnedBalanceProps {
  farmExtendedInfo: FarmExtendedInfo
}

export function EarnedBalance({ farmExtendedInfo }: EarnedBalanceProps) {
  const { rewardToken, earned, staked, rewardRate, earnedTimestamp, periodFinish, totalSupply } = farmExtendedInfo
  // disable in storybook preview to avoid change detection in chromatic
  const shouldRefresh = rewardRate.gt(0) && totalSupply.gt(0) && !import.meta.env.STORYBOOK_PREVIEW
  const { timestampInMs } = useTimestamp({
    refreshIntervalInMs: shouldRefresh ? STEP_IN_MS : undefined,
  })

  const currentEarned = calculateCurrentlyEarned({
    earned,
    staked,
    rewardRate,
    earnedTimestamp,
    periodFinish,
    timestampInMs,
    totalSupply,
  })
  const precision = calculatePrecision({ staked, rewardRate })

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

function getWholePart(value: BigNumber): string {
  const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
  return formatter.format(value.integerValue(BigNumber.ROUND_DOWN).toNumber())
}

function getFractionalPart(value: BigNumber, precision: number): string {
  precision = Math.max(precision, 2)
  return value.minus(value.integerValue(BigNumber.ROUND_DOWN)).toFixed(precision).slice(1)
}

interface CalculateCurrentlyEarnedParams {
  earned: NormalizedUnitNumber
  staked: NormalizedUnitNumber
  rewardRate: NormalizedUnitNumber
  earnedTimestamp: number
  periodFinish: number
  timestampInMs: number
  totalSupply: NormalizedUnitNumber
}
function calculateCurrentlyEarned({
  earned,
  staked,
  rewardRate,
  earnedTimestamp,
  periodFinish,
  timestampInMs,
  totalSupply,
}: CalculateCurrentlyEarnedParams): NormalizedUnitNumber {
  if (totalSupply.isZero()) {
    return earned
  }

  const periodFinishInMs = periodFinish * 1000
  const earnedTimestampInMs = earnedTimestamp * 1000

  const timeDiff = ((timestampInMs > periodFinishInMs ? periodFinishInMs : timestampInMs) - earnedTimestampInMs) / 1000
  const accruedEarned = staked.multipliedBy(rewardRate).multipliedBy(timeDiff)
  const earnedInTotal = NormalizedUnitNumber(earned.plus(accruedEarned))

  return earnedInTotal
}

interface CalculatePrecisionParams {
  staked: NormalizedUnitNumber
  rewardRate: NormalizedUnitNumber
}
function calculatePrecision({ staked, rewardRate }: CalculatePrecisionParams): number {
  const earnedIn1Step = staked.multipliedBy(rewardRate).multipliedBy(STEP_IN_MS / 1000)
  const precision = -Math.floor(Math.log10(earnedIn1Step.toNumber()))

  return Math.max(precision, 2)
}
