import { cn } from '@/ui/utils/style'
import React from 'react'
import { ButtonProps, UnstyledButton, buttonIconVariants, buttonVariants, renderButtonIcon } from '../button/Button'
import { Loader } from '../loader/Loader'

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'postfixIcon' | 'prefixIcon'> {
  children: JSX.Element
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant: _variant, size = 'm', type = 'button', loading = false, children, disabled, ...props },
    ref,
  ) => {
    const variant = loading ? 'loading' : disabled ? 'disabled' : _variant

    return (
      <UnstyledButton
        {...props}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, isIconOnly: true }), className)}
        ref={ref}
        type={type}
        size={size}
      >
        {loading && (
          <div className="absolute inset-0 flex animate-reveal items-center justify-center bg-reskin-neutral-50">
            <Loader className={buttonIconVariants({ size })} />
          </div>
        )}
        {renderButtonIcon(children, size)}
      </UnstyledButton>
    )
  },
)

IconButton.displayName = 'IconButton'
