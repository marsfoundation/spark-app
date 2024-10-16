import { cn } from '@/ui/utils/style'

import { AirdropInfo, ConnectedWalletInfo, RewardsInfo, SupportedChain } from '../types'
import { AirdropBadge } from './airdrop-badge/AirdropBadge'
import { NetworkSelector } from './network-selector/NetworkSelector'
import { RewardsBadge } from './rewards-badge/RewardsBadge'
import { SettingsDropdown } from './settings-dropdown/SettingsDropdown'
import { WalletDropdown } from './wallet-dropdown/WalletDropdown'

export interface NavbarActionsProps {
  mobileMenuCollapsed: boolean
  currentChain: SupportedChain
  supportedChains: SupportedChain[]
  openSelectNetworkDialog: () => void
  openConnectModal: () => void
  connectedWalletInfo: ConnectedWalletInfo | undefined
  airdropInfo: AirdropInfo
  rewardsInfo: RewardsInfo
  openSandboxDialog: () => void
  openDevSandboxDialog: () => void
  isSandboxEnabled: boolean
  isDevSandboxEnabled: boolean
}

export function NavbarActions({
  mobileMenuCollapsed,
  currentChain,
  openSelectNetworkDialog,
  openConnectModal,
  connectedWalletInfo,
  airdropInfo,
  rewardsInfo,
  openSandboxDialog,
  openDevSandboxDialog,
  isSandboxEnabled,
  isDevSandboxEnabled,
}: NavbarActionsProps) {
  return (
    <div
      className={cn(
        'mb-2 flex flex-col items-center justify-center gap-6',
        'lg:mb-0 lg:flex-row lg:justify-end lg:gap-2.5',
        mobileMenuCollapsed ? 'hidden lg:flex' : 'flex',
      )}
    >
      <RewardsBadge {...rewardsInfo} />
      <AirdropBadge {...airdropInfo} />
      <NetworkSelector currentChain={currentChain} openSelectNetworkDialog={openSelectNetworkDialog} />
      <WalletDropdown onConnect={openConnectModal} connectedWalletInfo={connectedWalletInfo} />
      <SettingsDropdown
        onSandboxModeClick={openSandboxDialog}
        isSandboxEnabled={isSandboxEnabled}
        onDevSandBoxModeClick={openDevSandboxDialog}
        isDevSandboxEnabled={isDevSandboxEnabled}
      />
    </div>
  )
}
