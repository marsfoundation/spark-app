import { TokenSymbol } from '@/domain/types/TokenSymbol'

interface AssetsGroup {
  type: 'stablecoins' | 'governance'
  assets: TokenSymbol[]
}

export interface FarmConfig {
  entryTokens: AssetsGroup
  rewardToken: TokenSymbol
}
