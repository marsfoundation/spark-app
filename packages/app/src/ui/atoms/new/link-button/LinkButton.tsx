import { cn } from '@/ui/utils/style'
import { forwardRef } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { ButtonContext, ButtonProps, buttonVariants } from '../button/Button'

export const LinkButton = forwardRef<HTMLAnchorElement, ButtonProps & LinkProps & { external?: boolean }>(
  ({ children, variant, size, spacing, external, className, ...props }, ref) => (
    <Link
      {...props}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(buttonVariants({ variant, size, spacing }), className)}
      ref={ref}
    >
      <ButtonContext.Provider value={{ size }}>{children}</ButtonContext.Provider>
    </Link>
  ),
)
