export enum InterestRate {
  Stable = 1,
  Variable = 2,
}

export const MAX_INT = BigInt(2 ** 256 - 1)

export const ZUSTAND_APP_STORE_LOCAL_STORAGE_KEY = 'zustand-app-store'
export const ZUSTAND_APP_STORE_LOCAL_STORAGE_VERSION = 2

export const apiUrl = import.meta.env.VITE_API_URL ?? '/api'
export const blockAnaliticaApiUrl = import.meta.env.VITE_BLOCK_ANALITICA_API_URL ?? '/ba-api'
export const infoSkyApiUrl = import.meta.env.VITE_INFO_SKY_API_URL ?? '/info-sky-api'
export const spark2ApiUrl = import.meta.env.VITE_SPARK2_API_URL ?? '/spark2-api'

// @note: all sandboxes created by the app begin (when expressed as strings) with this chain id. Ex: 30301719211032
export const SANDBOX_NETWORKS_CHAIN_ID_PREFIX = 3030

export const SPARK_UI_REFERRAL_CODE = 128 // 0x80
export const SPARK_UI_REFERRAL_CODE_BIGINT = BigInt(SPARK_UI_REFERRAL_CODE)
