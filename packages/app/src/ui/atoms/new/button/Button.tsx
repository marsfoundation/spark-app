import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/ui/utils/style'
import { Loader } from '../loader/Loader'

export const buttonVariants = cva('', {
  variants: {
    variant: {
      primary: cn(
        'before:-z-10 bg-gradient-spark-primary text-reskin-base-white before:absolute ',
        'active:before:bg-reskin-neutral-800 focus-visible:before:bg-reskin-base-white ',
        'before:inset-0 hover:before:bg-reskin-neutral-950 active:text-reskin-base-white before:transition-colors',
      ),
      secondary: cn(
        'bg-reskin-neutral-950 text-reskin-base-white active:bg-reskin-neutral-950 ',
        'hover:bg-reskin-neutral-800 active:text-reskin-base-white',
      ),
      tertiary: cn(
        'border border-reskin-border-primary border-solid bg-reskin-base-white',
        'text-reskin-neutral-950 shadow-xs active:bg-reskin-neutral-100 hover:bg-reskin-neutral-50',
      ),
      loading: 'cursor-wait bg-reskin-neutral-50 text-reskin-base-white',
      disabled: 'cursor-not-allowed bg-reskin-neutral-50 disabled:text-reskin-neutral-500',
    },
    size: {
      l: 'typography-button-1 h-12 px-3 py-3.5',
      m: 'typography-button-2 h-10 px-2 py-2.5',
      s: 'typography-button-2 h-8 p-2',
    },
    isIconOnly: {
      false: '',
    },
  },
  compoundVariants: [
    { size: 'l', isIconOnly: true, class: 'p-3.5' },
    { size: 'm', isIconOnly: true, class: 'p-2.5' },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'm',
    isIconOnly: false,
  },
})

export const buttonIconVariants = cva('', {
  variants: {
    size: {
      l: 'icon-sm',
      m: 'icon-sm',
      s: 'icon-xs',
    },
  },
})

export interface UnstyledButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonIconVariants> {
  asChild?: boolean
  prefixIcon?: JSX.Element
  postfixIcon?: JSX.Element
}

export const UnstyledButton = React.forwardRef<HTMLButtonElement, UnstyledButtonProps>(
  ({ asChild, disabled, className, type = 'button', prefixIcon, postfixIcon, size, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        {...props}
        disabled={disabled}
        className={cn(
          'relative isolate inline-flex select-none items-center justify-center gap-2 ',
          'overflow-hidden whitespace-nowrap rounded-sm transition-colors ',
          'focus-visible:bg-reskin-base-white focus-visible:text-reskin-neutral-950 ',
          'focus-visible:outline-none focus-visible:ring focus-visible:ring-reskin-primary-200 focus-visible:ring-offset-0',
          className,
        )}
        ref={ref}
        type={type}
      >
        <>
          {prefixIcon && renderButtonIcon(prefixIcon, size)}
          {children}
          {postfixIcon && renderButtonIcon(postfixIcon, size)}
        </>
      </Comp>
    )
  },
)

export interface ButtonProps extends UnstyledButtonProps, VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant: _variant, size = 'm', loading = false, children, disabled, ...props }, ref) => {
    const variant = loading ? 'loading' : disabled ? 'disabled' : _variant

    return (
      <UnstyledButton
        {...props}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        size={size}
      >
        {loading && (
          <div className="absolute inset-0 flex animate-reveal items-center justify-center bg-reskin-neutral-50">
            <Loader className={buttonIconVariants({ size })} />
          </div>
        )}
        {children}
      </UnstyledButton>
    )
  },
)

export function renderButtonIcon(icon: JSX.Element, size: ButtonProps['size']) {
  return React.cloneElement(icon, {
    className: cn(buttonIconVariants({ size }), icon.props.className),
  })
}

Button.displayName = 'Button'
