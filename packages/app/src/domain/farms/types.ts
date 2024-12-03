import { CheckedAddress } from '@marsfoundation/common-universal'
import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { Token } from '../types/Token'
import { TokenSymbol } from '../types/TokenSymbol'

export type AssetsGroup =
  | {
      type: 'stablecoins'
      name: 'Stablecoins'
      assets: TokenSymbol[]
    }
  | {
      type: 'governance'
      name: 'Governance Tokens'
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

export interface FarmApiDetails {
  apy: Percentage
  depositors: number
  rewardTokenPriceUsd?: NormalizedUnitNumber
  totalRewarded: NormalizedUnitNumber
}

export interface FarmBlockchainDetails {
  address: CheckedAddress
  entryAssetsGroup: AssetsGroup
  rewardType: FarmConfig['rewardType']
  name: string
  rewardToken: Token
  stakingToken: Token
  rewardRate: NormalizedUnitNumber
  earnedTimestamp: number
  periodFinish: number
  totalSupply: NormalizedUnitNumber
  earned: NormalizedUnitNumber
  staked: NormalizedUnitNumber
}

export type Farm = Partial<FarmApiDetails> & FarmBlockchainDetails
