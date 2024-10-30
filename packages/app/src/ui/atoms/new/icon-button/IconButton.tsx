import { cn } from '@/ui/utils/style'
import { VariantProps } from 'class-variance-authority'
import React from 'react'
import { buttonIconVariants, buttonVariants } from '../button/Button'
import { Loader } from '../loader/Loader'

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  children: JSX.Element
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant: _variant, size = 'm', type = 'button', loading = false, children, disabled, ...props },
    ref,
  ) => {
    const variant = loading ? 'loading' : disabled ? 'disabled' : _variant

    return (
      <button
        {...props}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, isIconOnly: true }), className)}
        ref={ref}
        type={type}
      >
        {loading && (
          <div className="absolute inset-0 flex animate-reveal items-center justify-center bg-reskin-neutral-50">
            <Loader className={buttonIconVariants({ size })} />
          </div>
        )}
        <>
          {' '}
          {React.cloneElement(children, {
            className: cn(buttonIconVariants({ size }), children.props.className),
          })}
        </>
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'
