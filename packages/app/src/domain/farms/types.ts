import { CheckedAddress } from '../types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { TokenSymbol } from '../types/TokenSymbol'

export interface AssetsGroup {
  type: 'stablecoins' | 'governance'
  name: string
  assets: TokenSymbol[]
}

export interface FarmConfig {
  address: CheckedAddress
  entryAssetsGroup: AssetsGroup
}

export interface FarmDetailsRowData {
  depositors: number
  tvl: NormalizedUnitNumber
  apy: Percentage
}
