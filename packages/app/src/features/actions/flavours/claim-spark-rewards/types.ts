import { Token } from '@/domain/types/Token'
import { Hex, NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface ClaimSparkRewardsObjective {
  type: 'claimSparkRewards'
  token: Token
  epoch: number
  cumulativeAmount: NormalizedUnitNumber
  merkleRoot: Hex
  merkleProof: Hex[]
}

export interface ClaimSparkRewardsAction {
  type: 'claimSparkRewards'
  token: Token
  epoch: number
  cumulativeAmount: NormalizedUnitNumber
  merkleRoot: Hex
  merkleProof: Hex[]
}
