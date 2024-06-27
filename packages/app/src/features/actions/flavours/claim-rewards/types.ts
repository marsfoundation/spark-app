import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Token } from '@/domain/types/Token'

export interface ClaimRewardsObjective {
  type: 'claimRewards'
  token: Token
  incentiveControllerAddress: CheckedAddress
  assets: CheckedAddress[]
}

export interface ClaimRewardsAction {
  type: 'claimRewards'
  token: Token
  incentiveControllerAddress: CheckedAddress
  assets: CheckedAddress[]
}
