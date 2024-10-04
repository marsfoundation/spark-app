import { CheckedAddress } from '../types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { Token } from '../types/Token'
import { TokenSymbol } from '../types/TokenSymbol'

export interface AssetsGroup {
  type: 'stablecoins' | 'governance'
  name: string
  assets: TokenSymbol[]
}

export type FarmConfig = {
  address: CheckedAddress
  entryAssetsGroup: AssetsGroup
  historyCutoff?: Date
} & (
  | {
      rewardType: 'token'
    }
  | {
      rewardType: 'points'
      rewardPoints: Token
    }
)

export interface Farm {
  address: CheckedAddress
  entryAssetsGroup: AssetsGroup
  rewardType: FarmConfig['rewardType']

  name: string

  apy: Percentage
  rewardToken: Token
  stakingToken: Token
  rewardRate: NormalizedUnitNumber
  earnedTimestamp: number
  periodFinish: number
  totalSupply: NormalizedUnitNumber
  totalRewarded: NormalizedUnitNumber

  earned: NormalizedUnitNumber
  staked: NormalizedUnitNumber

  depositors: number
}
