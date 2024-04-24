import { cn } from '@/ui/utils/style'

import { ConnectedWalletInfo, SupportedChain } from '../types'
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
  openSandboxDialog,
  openDevSandboxDialog,
  isSandboxEnabled,
  isDevSandboxEnabled,
}: NavbarActionsProps) {
  return (
    <div
      className={cn(
        'mb-2 flex flex-col items-center justify-center gap-6',
        'lg:mb-0 lg:flex-row lg:justify-end lg:gap-3.5',
        mobileMenuCollapsed ? 'hidden lg:flex' : 'flex',
      )}
    >
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
