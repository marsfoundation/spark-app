import { CheckedAddress } from '@/domain/types/CheckedAddress'

export type OracleType = 'fixed-usd' | 'vault'

export interface TokenConfig {
  address: CheckedAddress
  oracleType: OracleType
}
