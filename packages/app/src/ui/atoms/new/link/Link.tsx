import { cn } from '@/ui/utils/style'
import { VariantProps, cva } from 'class-variance-authority'
import { forwardRef } from 'react'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'

export interface LinkProps extends VariantProps<typeof linkVariants>, RouterLinkProps {
  external?: boolean
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, variant, underline, external, className, ...props }, ref) => (
    <RouterLink
      {...props}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(linkVariants({ variant, underline }), className)}
      ref={ref}
    >
      {children}
    </RouterLink>
  ),
)

const linkVariants = cva('cursor-pointer', {
  variants: {
    variant: {
      primary:
        'bg-gradient-spark-secondary bg-clip-text text-transparent active:brightness-[80%] hover:brightness-[90%]',
      secondary: 'text-brand-primary active:brightness-[200%] hover:brightness-[150%]',
    },
    underline: {
      true: 'underline underline-offset-2',
    },
  },
  compoundVariants: [
    {
      variant: ['primary', 'secondary'],
      className: cn(
        'rounded-[1px] focus-visible:outline-none focus-visible:ring',
        'focus-visible:ring-reskin-primary-200 focus-visible:ring-offset-0',
        '',
      ),
    },
  ],
})
