import { AssetsGroup } from '@/domain/farms/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

export enum InterestRate {
  Stable = 1,
  Variable = 2,
}

export const NATIVE_ASSET_MOCK_ADDRESS = CheckedAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')

export const MAX_INT = BigInt(2 ** 256 - 1)

export const ZUSTAND_APP_STORE_LOCAL_STORAGE_KEY = 'zustand-app-store'
export const ZUSTAND_APP_STORE_LOCAL_STORAGE_VERSION = 2

export const apiUrl = import.meta.env.VITE_API_URL ?? '/api'
export const blockAnaliticaApiUrl = import.meta.env.VITE_BLOCK_ANALITICA_API_URL ?? '/ba-api'
export const infoSkyApiUrl = import.meta.env.VITE_INFO_SKY_API_URL ?? '/info-sky-api'

// @note: all sandboxes created by the app begin (when expressed as strings) with this chain id. Ex: 30301719211032
export const SANDBOX_NETWORKS_CHAIN_ID_PREFIX = 3030

export const stablecoinsGroup: AssetsGroup = {
  type: 'stablecoins',
  name: 'Stablecoins',
  assets: [
    TokenSymbol('DAI'),
    TokenSymbol('USDC'),
    TokenSymbol('USDS'),
    ...(import.meta.env.VITE_DEV_STAKE_SAVINGS_TOKENS === '1' ? [TokenSymbol('sDAI'), TokenSymbol('sUSDS')] : []),
  ],
}
