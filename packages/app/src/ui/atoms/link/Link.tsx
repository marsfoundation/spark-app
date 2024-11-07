import React from 'react'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'

import { cn } from '@/ui/utils/style'

export interface LinkProps extends RouterLinkProps {
  external?: boolean
}

const linkStyle = cn(
  'cursor-pointer bg-gradient-spark-secondary active:brightness-[75%]',
  'rounded-[1px] bg-clip-text text-transparent hover:brightness-[85%]',
  'focus-visible:outline-none focus-visible:ring focus-visible:ring-reskin-primary-200 focus-visible:ring-offset-0',
)

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ to, className, external, ...props }, ref) => {
  if (external) {
    return (
      <a
        href={to.toString()}
        className={cn(linkStyle, className)}
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

  return <RouterLink to={to} className={cn(linkStyle, className)} ref={ref} {...props} />
})
Link.displayName = 'Link'

export { Link }
