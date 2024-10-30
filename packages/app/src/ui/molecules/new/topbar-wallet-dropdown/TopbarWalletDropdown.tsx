import { WalletDropdownContentInfo, WalletDropdownTriggerInfo } from '@/features/navbar/types'
import { Address } from '@/ui/atoms/address/Address'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { Link } from '@/ui/atoms/link/Link'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { CopyButton } from '../copy-button/CopyButton'
import { ConnectedButton } from './ConnectedButton'

export interface TopbarWalletDropdownProps {
  dropdownTriggerInfo: WalletDropdownTriggerInfo
  dropdownContentInfo: WalletDropdownContentInfo
}

export function TopbarWalletDropdown({ dropdownTriggerInfo, dropdownContentInfo }: TopbarWalletDropdownProps) {
  const [open, setOpen] = useState(false)

  const { address, blockExplorerAddressLink, isInSandbox, isEphemeralAccount, walletIcon } = dropdownContentInfo

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <ConnectedButton open={open} {...dropdownTriggerInfo} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-60">
        <div className="radius-sm m-1 flex flex-col items-center gap-3 bg-reskin-bg-secondary p-6">
          <img src={walletIcon} alt="Wallet icon" className="h-8 w-8" />
          <div className="flex items-center gap-2">
            <div className="typography-label-4 overflow-hidden text-primary">
              {isEphemeralAccount ? 'Ephemeral account' : <Address compact address={address} />}
            </div>
            <CopyButton text={address} size="s" />
          </div>
        </div>
        <DropdownMenuItem>
          <div className="flex items-center justify-between">
            <div className="text-basics-black">Connected Wallet</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setOpen(false)
            dropdownContentInfo.onDisconnect()
          }}
        >
          {isInSandbox ? 'Exit sandbox' : 'Disconnect'}
        </DropdownMenuItem>

        {!isEphemeralAccount && blockExplorerAddressLink && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to={blockExplorerAddressLink} external className="text-primary hover:text-primary">
                <DropdownMenuIcon icon={<ExternalLink />} />
                View on Explorer
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {/* <div className="flex flex-col">
          <div className="flex w-[calc(100vw-48px)] flex-col gap-4 border-basics-grey/50 border-b p-4 lg:w-64">
            <div className="flex items-center gap-3">
              <img src={walletIcon} alt="Wallet icon" className="h-5 w-5" />
              <div className="overflow-hidden text-basics-black">
                {isEphemeralAccount ? 'Ephemeral account' : <Address compact address={address} />}
              </div>
            </div>
            <div className="flex gap-2.5">
              <Button
                size="s"
                variant="secondary"
                onClick={() => {
                  setOpen(false)
                  dropdownContentInfo.onDisconnect()
                }}
              >
                {isInSandbox ? 'Exit sandbox' : 'Disconnect'}
              </Button>
            </div>
          </div>
          {!isEphemeralAccount && blockExplorerAddressLink && (
            <div className="flex items-center gap-2.5 p-4">
              <Link
                to={blockExplorerAddressLink}
                external
                className="flex items-center gap-2.5 font-medium text-basics-dark-grey text-sm"
              >
                <BoxArrowTopRight className="h-4 w-4" />
                View on Explorer
              </Link>
            </div>
          )}
        </div> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
