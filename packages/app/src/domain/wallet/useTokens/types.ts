import { CheckedAddress } from '@/domain/types/CheckedAddress'

export type ReserveOracleType = 'fixed-usd' | 'vault'

export interface TokenConfig {
  address: CheckedAddress
  reserveOracleType: ReserveOracleType
}
