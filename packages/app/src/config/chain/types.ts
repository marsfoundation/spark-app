import { SavingsInfoQueryOptions, SavingsInfoQueryParams } from '@/domain/savings-info/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { FarmConfig } from '@/domain/farms/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { ReserveOracleType } from '@/domain/wallet/useTokens/types'
import { SUPPORTED_CHAIN_IDS } from './constants'

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

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
  defaultAssetToBorrow: TokenSymbol
}

export type PermitSupport = Record<CheckedAddress, boolean>

export type Erc20TokensWithApproveFnMalformed = CheckedAddress[]

export type TokenSymbolToReplacedName = Record<TokenSymbol, { name: string; symbol: TokenSymbol }>

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

export interface TokenWithReserveOracleType {
  reserveReserveOracleType: ReserveOracleType
  address: CheckedAddress
  symbol: TokenSymbol
}

export type OracleFeedProvider = 'chainlink' | 'chronicle'

export type OracleType =
  | { type: 'market-price'; providedBy: OracleFeedProvider[] }
  | {
      type: 'yielding-fixed'
      ratio: (marketInfo: MarketInfo) => Promise<NormalizedUnitNumber>
      baseAsset: TokenSymbol
      providedBy: OracleFeedProvider[]
    }
  | { type: 'fixed' }
  | { type: 'underlying-asset'; asset: string }

export type SavingsInfoQuery = (args: SavingsInfoQueryParams) => SavingsInfoQueryOptions

export interface ChainConfigEntry {
  id: SupportedChainId
  meta: ChainMeta
  nativeAssetInfo: NativeAssetInfo
  permitSupport: PermitSupport
  erc20TokensWithApproveFnMalformed: Erc20TokensWithApproveFnMalformed
  tokenSymbolToReplacedName: TokenSymbolToReplacedName
  airdrop: Airdrop
  savingsDaiInfoQuery: SavingsInfoQuery | undefined
  savingsUsdsInfoQuery: SavingsInfoQuery | undefined
  daiSymbol: TokenSymbol
  sDaiSymbol: TokenSymbol
  USDSSymbol: TokenSymbol | undefined
  sUSDSSymbol: TokenSymbol | undefined
  mergedDaiAndSDaiMarkets: boolean
  savingsInputTokens: TokenSymbol[]
  extraTokens: TokenWithReserveOracleType[]
  farms: FarmConfig[]
  oracles: Record<TokenSymbol, OracleType>
}

export type ChainConfig = Record<SupportedChainId, ChainConfigEntry>
