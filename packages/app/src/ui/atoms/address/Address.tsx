import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { shortenAddress } from '@/ui/utils/shortenAddress'
import { cn } from '@/ui/utils/style'

export interface AddressProps {
  address: CheckedAddress
  className?: string
  postfix?: React.ReactNode
  compact?: boolean
}

export function Address({ className, address, postfix, compact }: AddressProps) {
  return (
    <span className={cn('flex min-w-0 flex-row flex-nowrap items-center gap-2', className)} aria-label={address}>
      <span aria-hidden="true" className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap">
        {compact ? shortenAddress(address) : address}
      </span>
      {postfix && <span className="flex-shrink-0">{postfix}</span>}
    </span>
  )
}
