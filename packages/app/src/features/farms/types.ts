import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

interface AssetsGroup {
  type: 'stablecoins' | 'governance'
  name: string
  assets: TokenSymbol[]
}

export interface FarmConfig {
  address: CheckedAddress
  entryAssetsGroup: AssetsGroup
  reward: TokenSymbol
}

export interface FarmInfo {
  apy: Percentage
}
