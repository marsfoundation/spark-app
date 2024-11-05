import { cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/ui/utils/style'
import { Button, ButtonIcon, ButtonIconType, ButtonProps } from '../button/Button'

const buttonWithIconSizeVariants = cva('aspect-square', {
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

export interface ButtonWithIconProps extends Omit<ButtonProps, 'children'> {
  icon: ButtonIconType
}

export const ButtonWithIcon = React.forwardRef<HTMLButtonElement, ButtonWithIconProps>(
  ({ className, size = 'm', icon, ...props }, ref) => {
    return (
      <Button {...props} className={cn(buttonWithIconSizeVariants({ size }), className)} ref={ref} size={size}>
        <ButtonIcon icon={icon} />
      </Button>
    )
  },
)

ButtonWithIcon.displayName = 'Button'
