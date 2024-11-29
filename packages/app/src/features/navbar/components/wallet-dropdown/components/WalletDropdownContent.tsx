import { WalletDropdownContentInfo } from '@/features/navbar/types'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import { Address } from '@/ui/atoms/address/Address'
import { Link } from '@/ui/atoms/link/Link'
import { Button } from '@/ui/atoms/new/button/Button'

export interface WalletDropdownContentProps extends WalletDropdownContentInfo {}

export function WalletDropdownContent({
  walletIcon,
  address,
  onDisconnect,
  blockExplorerAddressLink,
}: WalletDropdownContentProps) {
  return (
    <div className="flex flex-col">
      <div className="flex w-[calc(100vw-48px)] flex-col gap-4 border-primary border-b p-4 lg:w-64">
        <div className="flex items-center gap-3">
          <img src={walletIcon} alt="Wallet icon" className="h-5 w-5" />
          <div className="overflow-hidden text-primary">
            <Address compact address={address} />
          </div>
        </div>
        <div className="flex gap-2.5">
          <Button size="s" variant="secondary" onClick={onDisconnect}>
            Disconnect
          </Button>
        </div>
      </div>
      {blockExplorerAddressLink && (
        <div className="flex items-center gap-2.5 p-4">
          <Link
            to={blockExplorerAddressLink}
            external
            className="flex items-center gap-2.5 font-medium text-secondary text-sm"
          >
            <BoxArrowTopRight className="h-4 w-4" />
            View on Explorer
          </Link>
        </div>
      )}
    </div>
  )
}
