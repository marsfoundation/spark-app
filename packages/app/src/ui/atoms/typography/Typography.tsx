import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'

import { cn } from '@/ui/utils/style'

export type BaseElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'

const typographyVariants = cva('text-primary', {
  variants: {
    variant: {
      h1: 'font-semibold text-5xl leading-none tracking-tight',
      h2: 'font-semibold text-3xl leading-none tracking-tight',
      h3: 'font-semibold text-2xl leading-none tracking-tight',
      h4: 'font-semibold text-base leading-none tracking-tight',
      p: 'font-normal text-base',
      span: 'font-normal text-base',
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
