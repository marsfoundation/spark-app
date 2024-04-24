import { getChainConfigEntry } from '..'
import { NativeAssetInfo } from '../types'

export function getNativeAssetInfo(chainId: number): NativeAssetInfo {
  return getChainConfigEntry(chainId).nativeAssetInfo
}
