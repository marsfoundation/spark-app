import { Button, ButtonProps } from '@/ui/atoms/new/button/Button'
import { cn } from '@/ui/utils/style'
import { forwardRef } from 'react'

export const WalletButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...rest }, ref) => {
  return (
    <Button
      ref={ref}
      variant="secondary"
      size="m"
      className={cn('h-auto w-full justify-start gap-2 bg-white px-2 lg:h-10 lg:w-52', className)}
      data-testid="wallet-button"
      {...rest}
    />
  )
})
WalletButton.displayName = 'WalletButton'
