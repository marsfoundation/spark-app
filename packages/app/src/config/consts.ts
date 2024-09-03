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

// @todo: remove after wagmi config is updated with produciton chain address
export const MIGRATE_ACTIONS_ADDRESS = CheckedAddress('0x50f1a6C941E68701D774b5B81B7124865cBc6f0a')
export const STAKING_REWARDS_USDS_ADDRESS = CheckedAddress('0x8AFB0C54bAE39A5e56b984DF1C4b5702b2abf205')
export const USDS_PSM_ACTIONS = CheckedAddress('0x28e4B8BE2748E9BD4b9cEAc4E05069E58773Af7E')

export const stablecoinsGroup: AssetsGroup = {
  type: 'stablecoins',
  name: 'Stablecoins',
  assets: [TokenSymbol('DAI'), TokenSymbol('sDAI'), TokenSymbol('USDC'), TokenSymbol('USDS'), TokenSymbol('sUSDS')],
}
