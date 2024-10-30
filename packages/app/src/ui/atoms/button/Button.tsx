import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/ui/utils/style'
import { Link, LinkProps } from '../link/Link'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md border border-slate-700 border-opacity-10 font-semibold text-base ring-offset-background transition-colors disabled:pointer-events-none disabled:bg-slate-700 disabled:bg-opacity-10 disabled:text-white/70 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary-bg text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:text-blue-700',
        text: 'border-none text-secondary disabled:bg-transparent',
        icon: 'border-none',
        green: 'bg-sec-green text-basics-white hover:bg-green-700',
      },
      size: {
        sm: 'h-8 gap-1 rounded-lg px-3 py-2 text-xs',
        md: 'h-10 gap-1.5 rounded-lg px-4 py-2',
        lg: 'h-14 gap-2.5 rounded-xl px-6 py-4',
        undefined: '',
      },
      spaceAround: {
        none: 'h-auto p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  prefixIcon?: React.ReactNode
  postfixIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, spaceAround, asChild = false, type = 'button', prefixIcon, postfixIcon, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp {...props} className={cn(buttonVariants({ variant, size, spaceAround }), className)} ref={ref} type={type}>
        <>
          {prefixIcon}
          {props.children}
          {postfixIcon}
        </>
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export type LinkButtonProps = VariantProps<typeof buttonVariants> &
  LinkProps & { disabled?: boolean; prefixIcon?: React.ReactNode; postfixIcon?: React.ReactNode }

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, size, spaceAround, disabled, prefixIcon, postfixIcon, ...props }, ref) => {
    return (
      <>
        {disabled ? (
          <Button disabled className={cn(buttonVariants({ variant, size, spaceAround, className }))}>
            {prefixIcon}
            {props.children}
            {postfixIcon}
          </Button>
        ) : (
          <Link className={cn(buttonVariants({ variant, size, spaceAround, className }))} ref={ref} {...props}>
            {prefixIcon}
            {props.children}
            {postfixIcon}
          </Link>
        )}
      </>
    )
  },
)
LinkButton.displayName = 'LinkButton'
