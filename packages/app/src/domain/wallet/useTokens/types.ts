import { CheckedAddress } from '@/domain/types/CheckedAddress'

export type OracleType = 'fixed-usd' | 'erc4626'

export interface TokenConfig {
  address: CheckedAddress
  oracleType: OracleType
}
