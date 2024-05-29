import { ChevronDown, ChevronUp } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

import { WalletDropdownTriggerInfo } from '@/features/navbar/types'
import Eye from '@/ui/assets/eye.svg?react'
import MagicWand from '@/ui/assets/magic-wand.svg?react'
import { shortenAddress } from '@/ui/utils/shortenAddress'

import { WalletButton } from './WalletButton'

export interface ConnectedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, WalletDropdownTriggerInfo {
  open: boolean
}

// forwarding ref so dropdown menu trigger works with asChild
export const ConnectedButton = forwardRef<HTMLButtonElement, ConnectedButtonProps>(
  ({ mode, avatar, address, ensName, open, ...buttonProps }, ref) => {
    if (mode === 'sandbox') {
      return (
        <WalletButton ref={ref} {...buttonProps}>
          <MagicWand className='h-7 w-7 text-basics-dark-grey lg:h-5 lg:w-5' />
          Sandbox mode
          <Chevron open={open} />
        </WalletButton>
      )
    }

    if (mode === 'read-only') {
      return (
        <WalletButton ref={ref} {...buttonProps}>
          <Eye className='h-7 w-7 text-basics-dark-grey lg:h-5 lg:w-5' />
          Read-only mode
          <Chevron open={open} />
        </WalletButton>
      )
    }

    return (
      <WalletButton ref={ref} {...buttonProps}>
        <img src={avatar} alt="wallet-avatar" className="h-8 w-8 rounded-full lg:h-6 lg:w-6" />
        <div className="truncate">{ensName ? ensName : shortenAddress(address)}</div>
        <Chevron open={open} />
      </WalletButton>
    )
  },
)
ConnectedButton.displayName = 'ConnectedButton'

function Chevron({ open }: { open: boolean }) {
  if (open) {
    return <ChevronUp size={16} className='ml-auto text-basics-dark-grey' />
  }
  return <ChevronDown size={16} className='ml-auto text-basics-dark-grey' />
}
