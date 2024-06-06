import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

interface AdjustTokenRewardParams {
  airdropTimestamp: number
  currentTimestamp: number
  tokenRatePerSecond: NormalizedUnitNumber
  tokenReward: NormalizedUnitNumber
}

export function adjustTokenReward({
  airdropTimestamp,
  currentTimestamp,
  tokenRatePerSecond,
  tokenReward,
}: AdjustTokenRewardParams): NormalizedUnitNumber {
  const timeElapsed = currentTimestamp > airdropTimestamp ? currentTimestamp - airdropTimestamp : 0
  const tokensFromSnapshot = tokenRatePerSecond.multipliedBy(timeElapsed)
  return NormalizedUnitNumber(tokenReward.plus(tokensFromSnapshot))
}
