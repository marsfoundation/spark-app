import { ReserveOracleType } from '@/config/chain/types'
import { Address } from 'viem'
import { Reserve } from '../market-info/marketInfo'
import { NormalizedUnitNumber } from '../types/NumericValues'
import { Token } from '../types/Token'

export interface OracleInfo {
  oracle: ReserveOracleType | undefined
  token: Token
  price: NormalizedUnitNumber
  priceOracleAddress: Address
  chainId: number
  baseTokenReserve?: Reserve
  ratio?: NormalizedUnitNumber
}
