import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { WalletDropdownContentInfo } from '@/features/navbar/types'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import { Button } from '@/ui/atoms/button/Button'
import { Link } from '@/ui/atoms/link/Link'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { shortenAddress } from '@/ui/utils/shortenAddress'

export interface WalletDropdownContentProps extends WalletDropdownContentInfo {}

export function WalletDropdownContent({
  walletIcon,
  address,
  onDisconnect,
  balanceInfo,
  isEphemeralAccount,
  isInSandbox,
  blockExplorerAddressLink,
}: WalletDropdownContentProps) {
  return (
    <div className="flex flex-col">
      <div className="border-x-basics-dark-grey/30 flex w-[calc(100vw-48px)] flex-col gap-4 border-b p-4 lg:w-64">
        <div className="flex items-center gap-3">
          <img src={walletIcon} alt="Wallet icon" className="h-5 w-5" />
          <div className="text-basics-black">{isEphemeralAccount ? 'Ephemeral account' : shortenAddress(address)}</div>
        </div>
        <div className="flex gap-2.5">
          <Button size="sm" variant="secondary" onClick={onDisconnect}>
            {isInSandbox ? 'Exit sandbox' : 'Disconnect'}
          </Button>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-basics-dark-grey text-xs leading-none">Balance</div>
          {balanceInfo.isLoading ? (
            <Skeleton className="h-6 w-12" />
          ) : (
            <div className="text-basics-black text-xl font-semibold leading-relaxed tracking-wide">
              {USD_MOCK_TOKEN.formatUSD(balanceInfo.totalBalanceUSD)}
            </div>
          )}
        </div>
      </div>
      {!isEphemeralAccount && blockExplorerAddressLink && (
        <div className="flex items-center gap-2.5 p-4">
          <Link
            to={blockExplorerAddressLink}
            external
            className="text-basics-dark-grey flex items-center gap-2.5 text-sm font-medium"
          >
            <BoxArrowTopRight className="h-4 w-4" />
            View on Explorer
          </Link>
        </div>
      )}
    </div>
  )
}
