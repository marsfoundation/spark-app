import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/ui/utils/style'
import { assert } from '@/utils/assert'
import { RequiredProps } from '@/utils/types'
import { Loader } from '../loader/Loader'

const buttonVariants = cva(
  cn(
    'relative isolate inline-flex select-none items-center justify-center',
    'overflow-hidden whitespace-nowrap rounded-sm transition-colors',
    'focus-visible:bg-reskin-base-white focus-visible:text-reskin-neutral-950 ',
    'focus-visible:outline-none focus-visible:ring focus-visible:ring-reskin-primary-200 focus-visible:ring-offset-0',
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'before:-z-10 bg-gradient-spark-primary text-reskin-base-white before:absolute',
          'active:before:bg-reskin-neutral-800 focus-visible:before:bg-reskin-base-white',
          'before:inset-0 hover:before:bg-reskin-neutral-950 active:text-reskin-base-white before:transition-colors',
          'disabled:cursor-not-allowed disabled:before:bg-none disabled:before:bg-reskin-neutral-50 disabled:bg-reskin-neutral-50 disabled:text-reskin-neutral-500',
        ),
        secondary: cn(
          'bg-reskin-neutral-950 text-reskin-base-white active:bg-reskin-neutral-950',
          'hover:bg-reskin-neutral-800 active:text-reskin-base-white',
          'disabled:cursor-not-allowed disabled:border-none disabled:bg-reskin-neutral-50 disabled:text-reskin-neutral-500',
        ),
        tertiary: cn(
          'border border-primary border-solid bg-reskin-base-white',
          'text-reskin-neutral-950 shadow-xs active:bg-reskin-neutral-100 hover:bg-reskin-neutral-50',
          'disabled:cursor-not-allowed disabled:border-none disabled:bg-reskin-neutral-50 disabled:text-reskin-neutral-500',
        ),
        transparent: cn(
          'text-secondary transition-colors',
          'hover:text-reskin-neutral-700',
          'active:text-reskin-neutral-900',
          'disabled:cursor-not-allowed disabled:text-reskin-neutral-300',
        ),
        loading: 'cursor-wait bg-reskin-neutral-50 text-reskin-base-white',
      },
      size: {
        l: 'typography-button-1 h-12 px-3 py-3.5',
        m: 'typography-button-2 h-10 px-2 py-2.5',
        s: 'typography-button-2 h-8 p-2',
      },
      spacing: {
        s: 'gap-1',
        m: 'gap-2',
        l: 'gap-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'm',
      spacing: 'm',
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

type ButtonIconSize = NonNullable<VariantProps<typeof buttonIconVariants>['size']>
interface ButtonContextProps {
  size: ButtonIconSize
}
const ButtonContext = React.createContext<ButtonContextProps | null>(null)

function useButtonContext(): ButtonContextProps {
  const context = React.useContext(ButtonContext)
  assert(context, 'useButtonContext must be used within a Button component')
  return context
}

export type ButtonIconType = React.ComponentType<{ className?: string }>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    RequiredProps<Omit<VariantProps<typeof buttonVariants>, 'spacing'>> {
  asChild?: boolean
  loading?: boolean
  spacing?: VariantProps<typeof buttonVariants>['spacing']
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant: _variant,
      spacing,
      size = 'm',
      asChild = false,
      type = 'button',
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    const variant = loading ? 'loading' : _variant

    return (
      <Comp
        {...props}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, spacing }), className)}
        ref={ref}
        type={type}
      >
        {loading && (
          <div className="absolute inset-0 flex animate-reveal items-center justify-center bg-reskin-neutral-50">
            <Loader size={20} />
          </div>
        )}
        <ButtonContext.Provider value={{ size }}>{children}</ButtonContext.Provider>
      </Comp>
    )
  },
)
Button.displayName = 'Button'

interface ButtonIconProps {
  icon: ButtonIconType
  className?: string
}

export function ButtonIcon({ icon: Icon, className }: ButtonIconProps) {
  const { size } = useButtonContext()
  return <Icon className={cn(buttonIconVariants({ size }), className)} />
}
