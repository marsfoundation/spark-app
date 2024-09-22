import { Address } from 'viem'
import { Reserve } from '../market-info/marketInfo'
import { NormalizedUnitNumber } from '../types/NumericValues'
import { Token } from '../types/Token'

import { OracleFeedProvider } from '@/config/chain/types'
import { TokenSymbol } from '../types/TokenSymbol'

export interface OracleInfoBase {
  chainId: number
  price: NormalizedUnitNumber
  priceOracleAddress: Address
  token: Token
}

export interface MarketPriceOracleInfo extends OracleInfoBase {
  type: 'market-price'
  providedBy: OracleFeedProvider[]
}

export interface YieldingFixedOracleInfo extends OracleInfoBase {
  type: 'yielding-fixed'
  baseTokenReserve: Reserve
  ratio: NormalizedUnitNumber
  baseAsset: TokenSymbol
  providedBy: OracleFeedProvider[]
  tokenReserve: Reserve
}

export interface FixedOracleInfo extends OracleInfoBase {
  type: 'fixed'
}

export interface UnderlyingAssetOracleInfo extends OracleInfoBase {
  type: 'underlying-asset'
  asset: string
}

export interface UnknownOracleInfo extends OracleInfoBase {
  type: 'unknown'
}

export type OracleInfo =
  | MarketPriceOracleInfo
  | YieldingFixedOracleInfo
  | FixedOracleInfo
  | UnderlyingAssetOracleInfo
  | UnknownOracleInfo
