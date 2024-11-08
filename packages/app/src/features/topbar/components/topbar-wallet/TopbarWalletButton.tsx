import { ChevronUp } from 'lucide-react'
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
          <span>
            Sandbox <span className="hidden sm:inline">Mode</span>
          </span>
        </Button>
      )
    }

    const chevron = (
      <ButtonIcon
        icon={ChevronUp}
        className={cn(
          'hidden md:block',
          open ? 'rotate-0 text-brand' : 'rotate-180 text-secondary',
          '!icon-xs ml-auto',
        )}
      />
    )

    return (
      <Button {...buttonProps}>
        <img src={avatar} alt="wallet-avatar" className="icon-md rounded-full" />
        <div className="hidden truncate sm:block">{ensName ? ensName : shortenAddress(address)}</div>
        {chevron}
      </Button>
    )
  },
)

TopbarWalletButton.displayName = 'TopbarWalletButton'
