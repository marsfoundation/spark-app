import { CheckedAddress } from '@marsfoundation/common-universal'

// @note: zero-price oracle is used for tokens for which we don't have a price feed yet
export type OracleType = 'fixed-usd' | 'vault' | 'zero-price' | 'ssr-auth-oracle'

export type TokenConfig =
  | {
      address: CheckedAddress
      oracleType: Exclude<OracleType, 'vault'>
    }
  | {
      address: CheckedAddress
      oracleType: 'vault'
      sharesDecimals?: number
      assetsDecimals?: number
    }
