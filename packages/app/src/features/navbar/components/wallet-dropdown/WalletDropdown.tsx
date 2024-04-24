import { useState } from 'react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/ui/atoms/dropdown/DropdownMenu'

import { WalletDropdownContentInfo, WalletDropdownTriggerInfo } from '../../types'
import { NavbarActionWrapper } from '../NavbarActionWrapper'
import { ConnectButton } from './components/ConnectButton'
import { ConnectedButton } from './components/ConnectedButton'
import { WalletDropdownContent } from './components/WalletDropdownContent'

export interface WalletDropdownProps {
  connectedWalletInfo?: {
    dropdownTriggerInfo: WalletDropdownTriggerInfo
    dropdownContentInfo: WalletDropdownContentInfo
  }
  onConnect: () => void
}

export function WalletDropdown({ connectedWalletInfo, onConnect }: WalletDropdownProps) {
  const [open, setOpen] = useState(false)

  if (!connectedWalletInfo) {
    return <ConnectButton onConnect={onConnect} />
  }

  return (
    <NavbarActionWrapper label="Wallet">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <ConnectedButton open={open} {...connectedWalletInfo.dropdownTriggerInfo} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <WalletDropdownContent
            {...connectedWalletInfo.dropdownContentInfo}
            onDisconnect={() => {
              setOpen(false)
              connectedWalletInfo.dropdownContentInfo.onDisconnect()
            }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </NavbarActionWrapper>
  )
}
