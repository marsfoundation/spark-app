import { SavingsInfo } from '@/domain/savings-info/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { EnsName } from '@/domain/types/EnsName'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Reward } from './components/rewards-badge/types'

export interface SupportedChain {
  id: number
  name: string
}

export interface ConnectedWalletInfo {
  dropdownTriggerInfo: WalletDropdownTriggerInfo
  dropdownContentInfo: WalletDropdownContentInfo
}

export interface WalletDropdownTriggerInfo {
  mode: 'sandbox' | 'connected'
  avatar: string
  address: CheckedAddress
  ensName?: EnsName
}

export interface WalletDropdownContentInfo {
  walletIcon: string
  address: CheckedAddress
  onDisconnect: () => void
  blockExplorerAddressLink: string | undefined
}

export interface SavingsInfoQueryResults {
  data: SavingsInfo | null | undefined
  isLoading: boolean
}

export type Airdrop = {
  tokenReward: NormalizedUnitNumber
  tokenRatePerSecond: NormalizedUnitNumber
  timestampInMs: number
  tokenRatePrecision: number
  refreshIntervalInMs: number
}
export interface AirdropInfo {
  airdrop: Airdrop | undefined
  isLoading: boolean
  isError: boolean
}

export interface RewardsInfo {
  rewards: Reward[]
  totalClaimableReward: NormalizedUnitNumber
  onClaim: () => void
}
