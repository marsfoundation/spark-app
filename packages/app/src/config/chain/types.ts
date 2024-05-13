import { SavingsAPYQueryOptionsFactory } from '@/domain/savings-apy/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { SUPPORTED_CHAIN_IDS } from './constants'

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export interface NativeAssetInfo {
  nativeAssetName: string
  nativeAssetSymbol: TokenSymbol
  wrappedNativeAssetSymbol: TokenSymbol
  wrappedNativeAssetAddress: CheckedAddress
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
export type Airdrop = Record<TokenSymbol, TokenToAirdropAmounts>

export interface ChainConfigEntry {
  id: SupportedChainId
  meta: ChainMeta
  nativeAssetInfo: NativeAssetInfo
  permitSupport: PermitSupport
  erc20TokensWithApproveFnMalformed: Erc20TokensWithApproveFnMalformed
  tokenSymbolToReplacedName: TokenSymbolToReplacedName
  airdrop: Airdrop
  savingsAPYQueryOptionsFactory: SavingsAPYQueryOptionsFactory
}

export type ChainConfig = Record<SupportedChainId, ChainConfigEntry>
