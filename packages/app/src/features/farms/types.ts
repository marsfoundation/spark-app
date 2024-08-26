import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface FarmInfo {
  apy: Percentage
  rewardToken: Token
  stakingToken: Token
  deposit: NormalizedUnitNumber
}
