import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { shortenAddress } from '@/ui/utils/shortenAddress'
import { cn } from '@/ui/utils/style'
import { cva } from 'class-variance-authority'

export interface AddressProps {
  address: CheckedAddress
  className?: string
  postfix?: React.ReactNode
  compact?: boolean
}

const addressVariants = cva('flex-shrink whitespace-nowrap', {
  variants: {
    compact: {
      true: '',
      false: 'overflow-hidden text-ellipsis',
    },
  },
})

export function Address({ className, address, postfix, compact }: AddressProps) {
  return (
    <span className={cn('flex min-w-0 flex-row flex-nowrap items-center gap-2', className)} aria-label={address}>
      <span aria-hidden="true" className={addressVariants({ compact })}>
        {compact ? shortenAddress(address) : address}
      </span>
      {postfix && <span className="flex-shrink-0">{postfix}</span>}
    </span>
  )
}
