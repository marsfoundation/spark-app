import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/ui/utils/style'
import { Loader } from '../loader/Loader'

const buttonVariants = cva(
  cn(
    'relative isolate inline-flex select-none items-center justify-center gap-1 ',
    'overflow-hidden whitespace-nowrap rounded-sm transition-colors ',
    'focus-visible:bg-reskin-base-white focus-visible:text-reskin-neutral-950 ',
    'focus-visible:outline-none focus-visible:ring focus-visible:ring-reskin-primary-200 focus-visible:ring-offset-0',
  ),
  {
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
          'border border-primary border-solid bg-reskin-base-white',
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
    },
    defaultVariants: {
      variant: 'primary',
      size: 'm',
    },
  },
)

const buttonIconVariants = cva('', {
  variants: {
    size: {
      l: 'icon-sm',
      m: 'icon-sm',
      s: 'icon-xs',
    },
  },
})

type IconType = React.ComponentType<{ className?: string }>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  prefixIcon?: IconType
  postfixIcon?: IconType
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant: _variant,
      size = 'm',
      asChild = false,
      type = 'button',
      prefixIcon: PrefixIcon,
      postfixIcon: PostfixIcon,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    const variant = loading ? 'loading' : disabled ? 'disabled' : _variant

    return (
      <Comp
        {...props}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={type}
      >
        {loading && (
          <div className="absolute inset-0 flex animate-reveal items-center justify-center bg-reskin-neutral-50">
            <Loader size={20} />
          </div>
        )}
        <>
          {PrefixIcon && <PrefixIcon className={buttonIconVariants({ size })} />}
          <div className="px-1">{children}</div>
          {PostfixIcon && <PostfixIcon className={buttonIconVariants({ size })} />}
        </>
      </Comp>
    )
  },
)

Button.displayName = 'Button'
