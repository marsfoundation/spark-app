import { cn } from '@/ui/utils/style'

import { AirdropInfo, ConnectedWalletInfo, SupportedChain } from '../types'
import { AirdropBadge } from './airdrop-badge/AirdropBadge'
import { NetworkSelector } from './network-selector/NetworkSelector'
import { SettingsDropdown } from './settings-dropdown/SettingsDropdown'
import { WalletDropdown } from './wallet-dropdown/WalletDropdown'

export interface NavbarActionsProps {
  mobileMenuCollapsed: boolean
  currentChain: SupportedChain
  supportedChains: SupportedChain[]
  onNetworkChange: (chainId: number) => void
  openConnectModal: () => void
  connectedWalletInfo: ConnectedWalletInfo | undefined
  airdropInfo: AirdropInfo
  openSandboxDialog: () => void
  openDevSandboxDialog: () => void
  isSandboxEnabled: boolean
  isDevSandboxEnabled: boolean
}

export function NavbarActions({
  mobileMenuCollapsed,
  currentChain,
  supportedChains,
  onNetworkChange,
  openConnectModal,
  connectedWalletInfo,
  airdropInfo,
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
      <AirdropBadge {...airdropInfo} />
      <NetworkSelector
        currentChain={currentChain}
        supportedChains={supportedChains}
        onNetworkChange={onNetworkChange}
      />
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
