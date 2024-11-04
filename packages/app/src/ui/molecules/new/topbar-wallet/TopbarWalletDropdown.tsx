import { WalletDropdownContentInfo, WalletDropdownTriggerInfo } from '@/features/navbar/types'
import { Address } from '@/ui/atoms/address/Address'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIcon,
  DropdownMenuSeparator,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { Link } from '@/ui/atoms/link/Link'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { ExternalLink, Unplug } from 'lucide-react'
import { useState } from 'react'
import { CopyButton } from '../copy-button/CopyButton'
import { TopbarWalletButton } from './TopbarWalletButton'

export interface TopbarWalletDropdownProps {
  dropdownTriggerInfo: WalletDropdownTriggerInfo
  dropdownContentInfo: WalletDropdownContentInfo
}

export function TopbarWalletDropdown({ dropdownTriggerInfo, dropdownContentInfo }: TopbarWalletDropdownProps) {
  const [open, setOpen] = useState(false)

  const { address, blockExplorerAddressLink, walletIcon, onDisconnect } = dropdownContentInfo

  if (dropdownTriggerInfo.mode === 'sandbox') {
    return <TopbarWalletButton open={open} {...dropdownTriggerInfo} />
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <TopbarWalletButton open={open} {...dropdownTriggerInfo} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex w-60 flex-col gap-1.5 p-1">
        <div className="flex flex-col items-center gap-3 rounded-sm bg-secondary p-6">
          <div className="rounded-full bg-primary p-1">
            <img src={walletIcon} alt="Wallet icon" width={24} height={24} />
          </div>

          <div className="typography-label-4 overflow-hidden text-primary">
            <div className="flex items-center gap-1">
              <Address compact address={address} />
              <CopyButton text={address} />
            </div>
          </div>
        </div>

        <DropdownMenuItem asChild>
          <button
            className="cursor-pointer"
            onClick={() => {
              setOpen(false)
              onDisconnect()
            }}
          >
            <DropdownMenuItemIcon icon={Unplug} />
            Disconnect
          </button>
        </DropdownMenuItem>

        {blockExplorerAddressLink && (
          <>
            <DropdownMenuSeparator className="mx-1" />

            <DropdownMenuItem asChild>
              <Link to={blockExplorerAddressLink} external className="cursor-pointer text-primary hover:text-primary">
                <DropdownMenuItemIcon icon={ExternalLink} />
                View on Explorer
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

TopbarWalletDropdown.displayName = 'TopbarWalletDropdown'
