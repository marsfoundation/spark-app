import { SimplifiedQueryResult } from '@/utils/types'
import { CheckedAddress } from '../types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { Token, TokenWithoutPrice } from '../types/Token'
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
      rewardPoints: TokenWithoutPrice
    }
)

export interface FarmApiDetails {
  address: CheckedAddress
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
  stakingToken: Token
  rewardToken: TokenWithoutPrice
  rewardRate: NormalizedUnitNumber
  periodFinish: number
  totalSupply: NormalizedUnitNumber
  earned: NormalizedUnitNumber
  staked: NormalizedUnitNumber
  earnedTimestamp: number
}

export interface Farm {
  blockchainDetails: FarmBlockchainDetails
  apiDetails: SimplifiedQueryResult<FarmApiDetails>
}
