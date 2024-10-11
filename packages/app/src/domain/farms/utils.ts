import { TokenSymbol } from '../types/TokenSymbol'
import { AssetsGroup } from './types'

export function createGovernanceAssetsGroup(entryAssets: TokenSymbol[]): AssetsGroup {
  return {
    type: 'governance',
    name: 'Governance Tokens',
    assets: entryAssets,
  }
}
