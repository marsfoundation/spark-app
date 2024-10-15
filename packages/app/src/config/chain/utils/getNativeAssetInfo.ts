import { raise } from '@/utils/assert'
import { getChainConfigEntry } from '..'
import { NativeAssetInfo } from '../types'

export function getNativeAssetInfo(chainId: number): NativeAssetInfo {
  return (
    getChainConfigEntry(chainId).markets?.nativeAssetInfo ?? raise('Native asset info is not defined on this chain')
  )
}
