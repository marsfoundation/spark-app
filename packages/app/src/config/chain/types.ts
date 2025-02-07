import { SavingsConverterQueryOptions, SavingsConverterQueryParams } from '@/domain/savings-converters/types'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { CheckedAddress } from '@marsfoundation/common-universal'

import { FarmConfig } from '@/domain/farms/types'
import { OracleInfoFetcherParams, OracleInfoFetcherResult } from '@/domain/oracles/oracleInfoFetchers'
import { MyEarningsResult } from '@/domain/savings-charts/my-earnings-query/mainnet'
import { TokenConfig } from '@/domain/wallet/useTokens/types'
import { UseQueryOptions } from '@tanstack/react-query'
import { SUPPORTED_CHAIN_IDS } from './constants'

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export type MyEarningsQuery = (wallet: CheckedAddress) => UseQueryOptions<any, any, MyEarningsResult>

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

export type TokenWithOracleType = {
  symbol: TokenSymbol
} & TokenConfig

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

export type SavingsConverterQuery = (args: SavingsConverterQueryParams) => SavingsConverterQueryOptions

export interface MarketsConfig {
  defaultAssetToBorrow: TokenSymbol
  nativeAssetInfo: NativeAssetInfo
  tokenSymbolToReplacedName: TokenSymbolToNameReplacement
  oracles: Record<TokenSymbol, ReserveOracleType>
}

export interface AccountConfig {
  supportedStablecoins: TokenSymbol[]
  savingsToken: TokenSymbol
  underlyingToken: TokenSymbol
  fetchConverterQuery: (args: SavingsConverterQueryParams) => SavingsConverterQueryOptions
  savingsRateApiUrl: string | undefined
  myEarningsQuery: MyEarningsQuery | undefined
}

export interface SavingsConfig {
  accounts: AccountConfig[]
}

export interface FarmsConfig {
  getFarmDetailsApiUrl: (address: CheckedAddress) => string
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
