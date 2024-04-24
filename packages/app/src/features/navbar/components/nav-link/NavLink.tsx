import React from 'react'
import { Link, useMatch } from 'react-router-dom'

import { cn } from '@/ui/utils/style'

export interface NavLinkProps {
  to: string
  children: React.ReactNode
  postfix?: React.ReactNode
  onClick?: () => void
}

export function NavLink(props: NavLinkProps) {
  const matched = !!useMatch(props.to)

  return <NavLinkComponent {...props} selected={matched} />
}

export function NavLinkComponent({ children, selected, to, postfix, onClick }: NavLinkProps & { selected: boolean }) {
  return (
    <div className="relative flex min-h-fit flex-row justify-between lg:flex-col">
      <Link
        onClick={onClick}
        className={cn('flex flex-row', 'lg:grow lg:flex-col lg:justify-center')}
        to={to}
        data-testid={`navlink-${to}-${selected ? 'selected' : 'not-selected'}`}
      >
        <div className="flex flex-row items-center justify-center gap-1">
          <div
            className={cn(
              'text-primary text-xl font-semibold lg:text-base',
              selected && 'text-nav-primary',
              selected ? 'lg:text-primary' : 'lg:opacity-50 lg:hover:opacity-100',
            )}
          >
            {children}
          </div>
          {postfix}
        </div>
      </Link>
      {/* if not selected still render a pseudo element to keep the height */}
      <div
        className={cn(
          'absolute bottom-0 left-0 hidden h-1.5 w-full rounded-t-lg lg:block',
          selected && 'bg-nav-primary',
        )}
      />
    </div>
  )
}
