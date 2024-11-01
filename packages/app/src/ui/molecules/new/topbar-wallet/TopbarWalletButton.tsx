import { ChevronUp, Eye } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

import { WalletDropdownTriggerInfo } from '@/features/navbar/types'
import MagicWandCircle from '@/ui/assets/magic-wand-circle.svg?react'
import { shortenAddress } from '@/ui/utils/shortenAddress'

import { Button, ButtonIcon } from '@/ui/atoms/new/button/Button'
import { cn } from '@/ui/utils/style'

export interface TopbarWalletButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, WalletDropdownTriggerInfo {
  open: boolean
}

// forwarding ref so dropdown menu trigger works with asChild
export const TopbarWalletButton = forwardRef<HTMLButtonElement, TopbarWalletButtonProps>(
  ({ mode, avatar, address, ensName, open, ...props }, ref) => {
    const buttonProps = {
      ...props,
      className: 'w-full flex items-center justify-start gap-2.5',
      variant: 'tertiary',
      size: 'm',
      ref,
    } as const

    if (mode === 'sandbox') {
      return (
        <Button {...buttonProps} className={cn(buttonProps.className, 'pointer-events-none')}>
          <ButtonIcon icon={MagicWandCircle} />
          Sandbox Mode
        </Button>
      )
    }

    const chevron = (
      <ButtonIcon
        icon={ChevronUp}
        className={cn(open ? 'rotate-180 text-brand' : 'rotate-0 text-secondary', '!icon-xs ml-auto')}
      />
    )

    if (mode === 'read-only') {
      return (
        <Button {...buttonProps}>
          <ButtonIcon icon={Eye} />
          Read-only mode
          {chevron}
        </Button>
      )
    }

    return (
      <Button {...buttonProps}>
        <img src={avatar} alt="wallet-avatar" className="rounded-full" />
        <div className="truncate">{ensName ? ensName : shortenAddress(address)}</div>
        {chevron}
      </Button>
    )
  },
)

TopbarWalletButton.displayName = 'TopbarWalletButton'
