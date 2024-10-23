import { SavingsInfoQueryOptions, SavingsInfoQueryParams } from '@/domain/savings-info/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { FarmConfig } from '@/domain/farms/types'
import { OracleInfoFetcherParams, OracleInfoFetcherResult } from '@/domain/oracles/oracleInfoFetchers'
import { OracleType } from '@/domain/wallet/useTokens/types'
import { SUPPORTED_CHAIN_IDS } from './constants'

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export type GetApiUrl = (address: CheckedAddress) => string

export interface NativeAssetInfo {
  nativeAssetName: string
  nativeAssetSymbol: TokenSymbol
  wrappedNativeAssetSymbol: TokenSymbol
  wrappedNativeAssetAddress: CheckedAddress
  minRemainingNativeAssetBalance: NormalizedUnitNumber
}

export interface ChainMeta {
  name: string
  logo: string
}

export type PermitSupport = Record<CheckedAddress, boolean>

export type TokensWithMalformedApprove = CheckedAddress[]

export type TokenSymbolToNameReplacement = Record<TokenSymbol, { name: string; symbol: TokenSymbol }>

export interface TokenToAirdropAmounts {
  [token: TokenSymbol]: {
    deposit?: NormalizedUnitNumber
    borrow?: NormalizedUnitNumber
  }
}

export interface AirdropsPerAction {
  deposit: TokenSymbol[]
  borrow: TokenSymbol[]
}
export type Airdrop = Record<TokenSymbol, AirdropsPerAction>

export interface TokenWithOracleType {
  oracleType: OracleType
  address: CheckedAddress
  symbol: TokenSymbol
}

export type OracleFeedProvider = 'chainlink' | 'chronicle'

export type ReserveOracleType =
  | { type: 'market-price'; providedBy: OracleFeedProvider[] }
  | {
      type: 'yielding-fixed'
      baseAssetSymbol: TokenSymbol
      providedBy: OracleFeedProvider[]
      oracleFetcher: (params: OracleInfoFetcherParams) => Promise<OracleInfoFetcherResult>
    }
  | { type: 'fixed' }
  | { type: 'underlying-asset'; asset: string }

export type SavingsInfoQuery = (args: SavingsInfoQueryParams) => SavingsInfoQueryOptions

export interface MarketsConfig {
  defaultAssetToBorrow: TokenSymbol
  mergedDaiAndSDaiMarkets: boolean
  nativeAssetInfo: NativeAssetInfo
  tokenSymbolToReplacedName: TokenSymbolToNameReplacement
  oracles: Record<TokenSymbol, ReserveOracleType>
}

export interface SavingsConfig {
  inputTokens: TokenSymbol[]
  savingsDaiInfoQuery: SavingsInfoQuery | undefined
  savingsUsdsInfoQuery: SavingsInfoQuery | undefined
  savingsRateApiUrl: string | undefined
  getEarningsApiUrl: GetApiUrl | undefined
}

export interface FarmsConfig {
  getFarmDetailsApiUrl: GetApiUrl | undefined
  configs: FarmConfig[]
}

export interface ChainConfigEntry {
  originChainId: SupportedChainId
  daiSymbol: TokenSymbol | undefined
  sdaiSymbol: TokenSymbol | undefined
  usdsSymbol: TokenSymbol | undefined
  susdsSymbol: TokenSymbol | undefined
  psmStables: TokenSymbol[] | undefined
  meta: ChainMeta
  permitSupport: PermitSupport
  tokensWithMalformedApprove: TokensWithMalformedApprove
  airdrop: Airdrop
  extraTokens: TokenWithOracleType[]
  markets: MarketsConfig | undefined
  savings: SavingsConfig | undefined
  farms: FarmsConfig | undefined
}

export type ChainConfig = Record<SupportedChainId, ChainConfigEntry>
