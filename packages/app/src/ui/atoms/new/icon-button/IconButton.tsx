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

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: ButtonIconType
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'm', icon, ...props }, ref) => {
    return (
      <Button {...props} className={cn(iconButtonSizeVariants({ size }), className)} ref={ref} size={size}>
        <ButtonIcon icon={icon} />
      </Button>
    )
  },
)

IconButton.displayName = 'Button'
