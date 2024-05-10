import { MakerInfo } from '@/domain/maker-info/types'
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

export interface MakerInfoQueryResults {
  data: MakerInfo | null | undefined
  isLoading: boolean
  isChainSupported: boolean
}

export interface AirdropInfo {
  amount: NormalizedUnitNumber
  isLoading: boolean
  isError: boolean
}
