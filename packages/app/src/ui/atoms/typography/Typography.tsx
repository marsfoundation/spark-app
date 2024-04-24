import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '@/ui/utils/style'

export type BaseElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'

const typographyVariants = cva('text-primary', {
  variants: {
    variant: {
      h1: 'text-5xl font-semibold leading-none tracking-tight',
      h2: 'text-3xl font-semibold leading-none tracking-tight',
      h3: 'text-2xl font-semibold leading-none tracking-tight',
      h4: 'text-base font-semibold leading-none tracking-tight',
      p: 'text-base font-normal',
      span: 'text-base font-normal',
      prompt: 'text-prompt-foreground text-xs leading-none tracking-tight',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  element?: BaseElement
}

function variantToElement(variant: VariantProps<typeof typographyVariants>['variant']): BaseElement {
  if (variant === 'prompt') return 'span'
  return variant ?? 'p'
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(({ element, variant, className, ...props }, ref) => {
  const Element = element ?? variantToElement(variant)

  return <Element className={cn(typographyVariants({ variant, className }))} ref={ref as any} {...props} />
})
Typography.displayName = 'Typography'

export { Typography, type TypographyProps }
