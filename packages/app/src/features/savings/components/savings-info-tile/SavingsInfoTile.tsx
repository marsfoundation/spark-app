import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'
import { ReactNode } from 'react'

interface SavingsInfoTileProps {
  children: ReactNode
  className?: string
}
export function SavingsInfoTile({ children, className }: SavingsInfoTileProps) {
  return (
    <div className={cn('flex flex-col gap-1 px-3 first:pl-0 last:pr-0 xl:px-6', className)} role="generic">
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
      <div className="typography-label-4 md:typography-label-3 lg:typography-label-2 text-secondary">{children}</div>
      {tooltipText && <Info className="text-primary-inverse">{tooltipText}</Info>}
    </div>
  )
}

export interface ValueProps {
  children: ReactNode
  className?: string
}
function Value({ children, className }: ValueProps) {
  return (
    <p className={cn('typography-label-3 lg:typography-label-1 xl:typography-heading-5 text-primary', className)}>
      {children}
    </p>
  )
}

SavingsInfoTile.Label = Label
SavingsInfoTile.Value = Value
