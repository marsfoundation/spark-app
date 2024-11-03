import { cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/ui/utils/style'
import { Button, ButtonIcon, ButtonIconType, ButtonProps } from '../button/Button'

const iconButtonSizeVariants = cva('aspect-square', {
  variants: {
    size: {
      l: 'p-3.5',
      m: 'p-2.5',
      s: 'p-2',
    },
  },
  defaultVariants: {
    size: 'm',
  },
})

export type IconButtonProps = Omit<ButtonProps, 'children'> &
  (
    | {
        icon: ButtonIconType
        children?: never
      }
    | {
        children: React.ReactNode
        icon?: never
      }
  )

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'm', icon, children, ...props }, ref) => {
    return (
      <Button {...props} className={cn(iconButtonSizeVariants({ size }), className)} ref={ref} size={size}>
        {icon ? <ButtonIcon icon={icon} /> : children}
      </Button>
    )
  },
)

IconButton.displayName = 'Button'
