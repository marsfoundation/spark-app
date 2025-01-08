import { cn } from '@/ui/utils/style'
import { VariantProps, cva } from 'class-variance-authority'
import { forwardRef } from 'react'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'

export interface LinkProps extends VariantProps<typeof linkVariants>, RouterLinkProps {
  external?: boolean
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, variant, external, className, ...props }, ref) => (
    <RouterLink
      {...props}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(linkVariants({ variant }), className)}
      ref={ref}
    >
      {children}
    </RouterLink>
  ),
)

const linkVariants = cva('', {
  variants: {
    variant: {
      primary:
        'bg-gradient-spark-secondary bg-clip-text text-transparent hover:brightness-[90%] active:brightness-[80%]',
      secondary: 'text-brand-primary hover:brightness-[150%] active:brightness-[200%]',
      underline: 'underline underline-offset-2',
      unstyled: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
  compoundVariants: [
    {
      variant: ['primary', 'secondary'],
      className: cn(
        'cursor-pointer rounded-[1px] focus-visible:outline-none focus-visible:ring',
        'focus-visible:ring-primary-200 focus-visible:ring-offset-0',
      ),
    },
  ],
})
