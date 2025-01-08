import { cn } from '@/ui/utils/style'
import { Slot } from '@radix-ui/react-slot'
import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'

const dropdownItemVariants = cva(
  cn(
    'typography-button-2 group relative flex cursor-default select-none items-center',
    'gap-2 rounded-sm p-4 text-primary outline-none focus:outline-none ',
    'transition-colors data-[disabled]:pointer-events-none ',
    'w-full justify-start data-[disabled]:opacity-50',
  ),
  {
    variants: {
      variant: {
        primary: 'bg-primary hover:bg-secondary focus:bg-secondary',
        secondary: 'bg-primary hover:bg-tertiary focus:bg-tertiary',
      },
      withSeparator: {
        true: 'border-primary border-b',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

interface MenuItemProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dropdownItemVariants> {
  asChild?: boolean
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ className, variant, asChild, withSeparator, ...props }, ref) => {
    const Component = asChild ? Slot : 'div'

    return (
      <Component ref={ref} className={cn(dropdownItemVariants({ variant, withSeparator }), className)} {...props} />
    )
  },
)

MenuItem.displayName = 'MenuItem'

export function MenuItemIcon({
  icon: Icon,
  className,
}: { icon: React.ComponentType<{ className?: string }>; className?: string }) {
  return (
    <Icon
      className={cn(
        'icon-xs icon-secondary group-hover:text-brand-primary group-focus-visible:text-brand-primary',
        className,
      )}
    />
  )
}

MenuItemIcon.displayName = 'MenuItemIcon'
