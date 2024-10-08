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

export interface FarmApiInfo {
  apy: Percentage
  depositors: number
  rewardTokenPriceUsd?: NormalizedUnitNumber
  totalRewarded: NormalizedUnitNumber
}

export interface FarmBlockchainInfo {
  rewardTokenAddress: CheckedAddress
  stakingTokenAddress: CheckedAddress
  rewardRate: NormalizedUnitNumber
  periodFinish: number
  totalSupply: NormalizedUnitNumber
  earned: NormalizedUnitNumber
  staked: NormalizedUnitNumber
  earnedTimestamp: number
}

export interface Farm extends FarmApiInfo, FarmBlockchainInfo {
  address: CheckedAddress
  entryAssetsGroup: AssetsGroup
  rewardType: FarmConfig['rewardType']
  name: string
  rewardToken: Token
  stakingToken: Token
}
