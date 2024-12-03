import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'
import { ReactNode } from 'react'

interface SavingsInfoTileProps {
  children: ReactNode
  className?: string
}
export function SavingsInfoTile({ children, className }: SavingsInfoTileProps) {
  return (
    <div className={cn('flex flex-col gap-1 px-3 xl:px-6 last:pr-0 first:pl-0', className)} role="generic">
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
      <div className="typography-label-6 md:typography-label-5 lg:typography-label-4 text-secondary">{children}</div>
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
    <p className={cn('typography-label-5 lg:typography-label-3 xl:typography-label-2 text-primary', className)}>
      {children}
    </p>
  )
}

SavingsInfoTile.Label = Label
SavingsInfoTile.Value = Value
