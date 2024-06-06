import { SavingsInfo } from '@/domain/savings-info/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { EnsName } from '@/domain/types/EnsName'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export interface SupportedChain {
  id: number
  name: string
}

export interface ConnectedWalletInfo {
  dropdownTriggerInfo: WalletDropdownTriggerInfo
  dropdownContentInfo: WalletDropdownContentInfo
}

export interface WalletDropdownTriggerInfo {
  mode: 'read-only' | 'sandbox' | 'connected'
  avatar: string
  address: CheckedAddress
  ensName?: EnsName
}

export interface WalletDropdownContentInfo {
  walletIcon: string
  address: CheckedAddress
  onDisconnect: () => void
  balanceInfo: BalanceInfo
  isEphemeralAccount: boolean
  isInSandbox: boolean
  blockExplorerAddressLink: string | undefined
}

export interface BalanceInfo {
  totalBalanceUSD: NormalizedUnitNumber
  isLoading: boolean
}

export interface SavingsInfoQueryResults {
  data: SavingsInfo | null | undefined
  isLoading: boolean
}

export type Airdrop = {
  tokenReward: NormalizedUnitNumber
  tokenRatePerInterval: NormalizedUnitNumber
  tokenRatePrecision: number
  refreshIntervalInMs: number
}
export interface AirdropInfo {
  airdrop: Airdrop | undefined
  isLoading: boolean
  isError: boolean
}
