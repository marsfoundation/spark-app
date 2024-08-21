import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { AssetsGroup } from '@/features/farms/types'

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
export const mkrAtlasApiUrl = import.meta.env.VITE_MKR_ATLAS_API_URL ?? '/mkr-atlas-api'

// @note: all sandboxes created by the app begin (when expressed as strings) with this chain id. Ex: 30301719211032
export const SANDBOX_NETWORKS_CHAIN_ID_PREFIX = 3030

// @todo: remove after wagmi config is updated with produciton chain address
export const MIGRATE_ACTIONS_ADDRESS = '0xB08543E5Ba2a382dd38E84Fe12656Cd35A42e12B'

export const STAKING_REWARDS_NST_ADDRESS = CheckedAddress('0x5eeB3D8D60B06a44f6124a84EeE7ec0bB747BE6d')
export const stablecoinsGroup: AssetsGroup = {
  type: 'stablecoins',
  name: 'Stablecoins',
  assets: [TokenSymbol('DAI'), TokenSymbol('USDC'), TokenSymbol('USDT')],
}
