import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

export interface AssetsGroup {
  type: 'stablecoins' | 'governance'
  name: string
  assets: TokenSymbol[]
}

export interface FarmConfig {
  address: CheckedAddress
  entryAssetsGroup: AssetsGroup
}

export interface FarmInfo {
  apy: Percentage
  rewardToken: Token
  stakingToken: Token
  deposit: NormalizedUnitNumber
}
