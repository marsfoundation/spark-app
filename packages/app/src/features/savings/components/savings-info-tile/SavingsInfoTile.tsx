import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'

interface SavingsInfoTileProps extends VariantProps<typeof savingsInfoTileVariants> {
  children: ReactNode
  className?: string
}
export function SavingsInfoTile({ children, alignItems, className }: SavingsInfoTileProps) {
  return (
    <div className={cn(savingsInfoTileVariants({ alignItems }), className)} role="generic">
      {children}
    </div>
  )
}

interface LabelProps {
  children: ReactNode
  tooltipContent?: React.ReactNode
}
function Label({ children, tooltipContent: tooltipText }: LabelProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="font-semibold text-basics-dark-grey text-xs leading-none tracking-wide">{children}</div>
      {tooltipText && <Info>{tooltipText}</Info>}
    </div>
  )
}

export interface ValueProps extends VariantProps<typeof valueVariants> {
  children: ReactNode
  className?: string
}
function Value({ children, size, color, className }: ValueProps) {
  return <p className={cn(valueVariants({ size, color }), className)}>{children}</p>
}

const savingsInfoTileVariants = cva('inline-flex flex-col gap-1', {
  variants: {
    alignItems: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
    },
  },
  defaultVariants: {
    alignItems: 'start',
  },
})

const valueVariants = cva('font-semibold', {
  variants: {
    size: {
      base: 'text-sm md:text-base',
      medium: 'text-lg md:text-2xl',
      large: 'text-2xl md:text-4xl',
      extraLarge: 'text-3xl md:text-5xl',
      huge: 'text-5xl leading-tight md:text-7xl',
    },
    color: {
      dark: 'text-white',
      green: 'text-sec-green',
    },
  },
  defaultVariants: {
    size: 'base',
    color: 'dark',
  },
})

SavingsInfoTile.Label = Label
SavingsInfoTile.Value = Value
