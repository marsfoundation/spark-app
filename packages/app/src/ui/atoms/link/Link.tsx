import React from 'react'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'

import { cn } from '@/ui/utils/style'

export interface LinkProps extends RouterLinkProps {
  external?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ to, className, external, ...props }, ref) => {
  if (external) {
    return (
      <a
        href={to.toString()}
        className={cn('cursor-pointer text-secondary hover:text-primary', className)}
        target="_blank"
        rel="noreferrer"
        ref={ref}
        onClick={(e) => {
          e.stopPropagation()
        }}
        {...props}
      />
    )
  }

  return <RouterLink to={to} className={cn('text-secondary hover:text-primary', className)} ref={ref} {...props} />
})
Link.displayName = 'Link'

export { Link }
