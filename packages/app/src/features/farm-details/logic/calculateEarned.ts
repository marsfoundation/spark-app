import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import BigNumber from 'bignumber.js'

export interface CalculateEarnedParams {
  earned: NormalizedUnitNumber
  staked: NormalizedUnitNumber
  rewardRate: NormalizedUnitNumber
  earnedTimestamp: number
  periodFinish: number
  timestampInMs: number
  totalSupply: NormalizedUnitNumber
}

export function calculateEarned({
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
