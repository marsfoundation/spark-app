import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Token } from '@/domain/types/Token'

export interface ClaimMarketRewardsObjective {
  type: 'claimMarketRewards'
  token: Token
  incentiveControllerAddress: CheckedAddress
  assets: CheckedAddress[]
}

export interface ClaimMarketRewardsAction {
  type: 'claimMarketRewards'
  token: Token
  incentiveControllerAddress: CheckedAddress
  assets: CheckedAddress[]
}
