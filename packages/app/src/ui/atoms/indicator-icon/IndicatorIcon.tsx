import { VariantProps, cva } from 'class-variance-authority'
import { ComponentType } from 'react'

import { cn } from '@/ui/utils/style'

export type IndicatorIconVariant = NonNullable<VariantProps<typeof variants>['variant']>
export interface IndicatorIconProps extends VariantProps<typeof variants> {
  icon: ComponentType<{ className?: string }>
  variant: IndicatorIconVariant
  className?: string
}

export function IndicatorIcon({ icon: Icon, variant, size, className }: IndicatorIconProps) {
  return <Icon className={cn(variants({ variant, size }), className)} />
}

const variants = cva('', {
  variants: {
    variant: {
      success: 'text-system-success-primary',
      neutral: 'text-secondary',
      warning: 'text-system-warning-primary',
      error: 'text-system-error-primary',
    },
    size: {
      sm: 'h-5 w-5 md:h-4 md:w-4',
      md: 'h-6 w-6 md:h-5 md:w-5',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})
