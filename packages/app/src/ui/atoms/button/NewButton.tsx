import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/ui/utils/style'
import { Loader } from '../loader/Loader'

const buttonVariants = cva(
  'relative isolate inline-flex select-none items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-reskin-sm transition-colors disabled:cursor-not-allowed disabled:bg-reskin-neutral-50 disabled:text-reskin-neutral-500 focus-visible:outline-none focus-visible:ring focus-visible:ring-reskin-primary-200 focus-visible:ring-offset-0',
  {
    variants: {
      variant: {
        primary:
          'before:-z-10 bg-gradient-spark-primary text-reskin-base-white before:absolute before:inset-0 active:enabled:before:bg-reskin-neutral-800 disabled:bg-none hover:enabled:before:bg-reskin-base-black before:transition-colors before:content-[""]',
        secondary:
          'bg-reskin-base-black text-reskin-base-white active:enabled:bg-reskin-base-black hover:enabled:bg-reskin-neutral-800',
        tertiary:
          'border border-reskin-border-primary border-solid bg-reskin-base-white text-reskin-base-black shadow-xs disabled:border-none active:enabled:bg-reskin-neutral-100 hover:enabled:bg-reskin-neutral-50 disabled:shadow-none',
        loading: 'cursor-wait bg-reskin-neutral-50',
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  prefixIcon?: React.ReactNode
  postfixIcon?: React.ReactNode
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = 'm',
      asChild = false,
      type = 'button',
      prefixIcon,
      postfixIcon,
      loading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        {...props}
        className={cn(buttonVariants({ variant: loading ? 'loading' : variant, size }), className)}
        ref={ref}
        type={type}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-reskin-neutral-50">
            <Loader size={20} />
          </div>
        )}
        <>
          {prefixIcon}
          <div className="px-1">{children}</div>
          {postfixIcon}
        </>
      </Comp>
    )
  },
)

Button.displayName = 'Button'
