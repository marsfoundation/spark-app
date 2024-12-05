import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'

export interface FarmInfo {
  apy: Percentage
  rewardToken: Token
  stakingToken: Token
  deposit: NormalizedUnitNumber
}
