import { ChevronDown, ChevronUp } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

import { WalletDropdownTriggerInfo } from '@/features/navbar/types'
import Eye from '@/ui/assets/eye.svg?react'
import MagicWandCircle from '@/ui/assets/magic-wand-circle.svg?react'
import { shortenAddress } from '@/ui/utils/shortenAddress'

import { Button } from '@/ui/atoms/new/button/Button'

export interface ConnectedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, WalletDropdownTriggerInfo {
  open: boolean
}

// forwarding ref so dropdown menu trigger works with asChild
export const ConnectedButton = forwardRef<HTMLButtonElement, ConnectedButtonProps>(
  ({ mode, avatar, address, ensName, open, ...props }, ref) => {
    const buttonProps = {
      ...props,
      className: 'w-full flex items-center gap-2.5',
      variant: 'tertiary',
      size: 'm',
      ref,
      postfixIcon: <Chevron open={open} />,
    } as const

    if (mode === 'sandbox') {
      return (
        <Button prefixIcon={<MagicWandCircle />} {...buttonProps}>
          Sandbox Mode
        </Button>
      )
    }

    if (mode === 'read-only') {
      return (
        <Button prefixIcon={<Eye />} {...buttonProps}>
          Read-only mode
        </Button>
      )
    }

    return (
      <Button prefixIcon={<img src={avatar} alt="wallet-avatar" className="rounded-full" />} {...buttonProps}>
        <div className="truncate">{ensName ? ensName : shortenAddress(address)}</div>
      </Button>
    )
  },
)
ConnectedButton.displayName = 'ConnectedButton'

function Chevron({ open }: { open: boolean }) {
  if (open) {
    return <ChevronUp size={16} className="ml-auto text-basics-dark-grey" />
  }
  return <ChevronDown size={16} className="ml-auto text-basics-dark-grey" />
}
