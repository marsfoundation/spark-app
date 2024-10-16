import { CheckedAddress } from '@/domain/types/CheckedAddress'

// @note: zero-price oracle is used for tokens for which we don't have a price feed yet
export type OracleType = 'fixed-usd' | 'vault' | 'zero-price' | 'ssr-auth-oracle'

export interface TokenConfig {
  address: CheckedAddress
  oracleType: OracleType
}
