import { ReserveOracleType } from '@/config/chain/types'
import { Address } from 'viem'
import { NormalizedUnitNumber } from '../types/NumericValues'
import { Token } from '../types/Token'

export type OracleInfo = {
  oracle: ReserveOracleType | undefined
  token: Token
  price: NormalizedUnitNumber
  priceOracleAddress: Address
  chainId: number
  baseToken?: Token
  ratio?: NormalizedUnitNumber
}
