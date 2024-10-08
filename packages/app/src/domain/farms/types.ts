import { QueryResultState } from '@/utils/transformQueryResult'
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
  address: CheckedAddress
  apy: Percentage
  depositors: number
  rewardTokenPriceUsd?: NormalizedUnitNumber
  totalRewarded: NormalizedUnitNumber
}

export interface FarmBlockchainInfo {
  address: CheckedAddress
  entryAssetsGroup: AssetsGroup
  rewardType: FarmConfig['rewardType']
  name: string
  stakingToken: Token
  rewardToken: Token
  rewardRate: NormalizedUnitNumber
  periodFinish: number
  totalSupply: NormalizedUnitNumber
  earned: NormalizedUnitNumber
  staked: NormalizedUnitNumber
  earnedTimestamp: number
}

export interface Farm {
  blockchainInfo: FarmBlockchainInfo
  apiInfo: QueryResultState<FarmApiInfo>
}
