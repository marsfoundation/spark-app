import { forwardRef } from 'react'

import { Button, ButtonProps } from '@/ui/atoms/button/Button'
import { cn } from '@/ui/utils/style'

export const WalletButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...rest }, ref) => {
  return (
    <Button
      ref={ref}
      variant="secondary"
      size="md"
      className={cn('h-auto w-full justify-start gap-2 px-2', 'lg:h-10 lg:w-52', className)}
      data-testid="wallet-button"
      {...rest}
    />
  )
})
WalletButton.displayName = 'WalletButton'
