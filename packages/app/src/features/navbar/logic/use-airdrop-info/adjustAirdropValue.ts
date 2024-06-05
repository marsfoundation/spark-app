import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Airdrop } from '../../types'

export function adjustAirdropValue(airdrop: Airdrop, timestamp: number): NormalizedUnitNumber {
  const timeElapsed = timestamp > airdrop.timestamp ? timestamp - airdrop.timestamp : 0
  const tokensFromSnapshot = airdrop.tokenRate.multipliedBy(timeElapsed)
  return NormalizedUnitNumber(airdrop.tokenReward.plus(tokensFromSnapshot))
}
