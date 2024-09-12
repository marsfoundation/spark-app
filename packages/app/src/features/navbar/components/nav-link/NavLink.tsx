import React from 'react'
import { Link, useMatch } from 'react-router-dom'

import { cn } from '@/ui/utils/style'
import { VariantProps, cva } from 'class-variance-authority'

export interface NavLinkProps extends NavLinkComponentProps {
  to: string
  onClick?: () => void
  className?: string
}

export function NavLink({ to, children, onClick, className, ...rest }: NavLinkProps) {
  const selected = !!useMatch(to)

  return (
    <Link
      onClick={onClick}
      to={to}
      data-testid={`navlink-${to}-${selected ? 'selected' : 'not-selected'}`}
      className={cn(
        'rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <NavLinkComponent selected={selected} {...rest}>
        {children}
      </NavLinkComponent>
    </Link>
  )
}

interface NavLinkComponentProps {
  children: React.ReactNode
  selected?: boolean
  postfix?: React.ReactNode
  variant?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md'
  shady?: boolean
  className?: string
}
export function NavLinkComponent({
  children,
  selected,
  postfix,
  variant = 'horizontal',
  size = 'md',
  shady,
  className,
}: NavLinkComponentProps) {
  return (
    <NavLinkBox>
      <NavLinkBox.Content
        shady={shady}
        selected={selected}
        postfix={postfix}
        variant={variant}
        size={size}
        className={className}
      >
        {children}
      </NavLinkBox.Content>
      <NavLinkBox.Indicator selected={selected} variant={variant} />
    </NavLinkBox>
  )
}

export function NavLinkBox({ children, className, ...rest }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn('relative isolate flex h-full w-full flex-row justify-between lg:flex-col', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

const pseudoElementVariants = cva('-z-10 absolute bottom-0 left-0 hidden lg:block', {
  variants: {
    variant: {
      horizontal: 'h-1.5 w-full rounded-t-lg',
      vertical: 'h-full w-1.5 rounded-r-lg',
    },
    selected: {
      true: 'bg-nav-primary',
    },
  },
})

export function NavLinkIndicator({
  variant = 'horizontal',
  selected,
  className,
  ...rest
}: VariantProps<typeof pseudoElementVariants> & React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn(
        pseudoElementVariants({
          variant,
          selected,
        }),
      )}
      {...rest}
    />
  )
}

const contentVariants = cva('flex h-full w-full flex-row items-center gap-1 font-semibold text-primary', {
  variants: {
    variant: {
      horizontal: 'lg:justify-center',
      vertical: 'p-4',
    },
    shady: {
      true: 'opacity-50 hover:opacity-100',
    },
    selected: {
      true: 'text-nav-primary lg:text-primary',
      false: 'lg:hover:opacity-100 lg:opacity-50',
    },
    size: {
      sm: 'text-base lg:text-sm',
      md: 'text-xl lg:text-base',
    },
  },
})

export function NavLinkContent({
  className,
  variant = 'horizontal',
  shady,
  selected,
  size = 'md',
  children,
  postfix,
  ...rest
}: Omit<React.HTMLProps<HTMLDivElement>, 'size'> & { postfix?: React.ReactNode } & VariantProps<
    typeof contentVariants
  >) {
  return (
    <div
      className={cn(
        contentVariants({
          shady: shady && !selected,
          selected,
          size,
          variant,
        }),
        className,
      )}
      {...rest}
    >
      {children}
      {postfix}
    </div>
  )
}

NavLinkBox.Indicator = NavLinkIndicator
NavLinkBox.Content = NavLinkContent
