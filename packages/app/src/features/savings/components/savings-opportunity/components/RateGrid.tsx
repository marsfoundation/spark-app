import { cn } from '@/ui/utils/style'
import { ReactNode } from 'react'

export interface RateGridProps {
  children: ReactNode
  hasNoCash?: boolean
}

export function RateGrid({ children, hasNoCash }: RateGridProps) {
  return (
    <div className={cn('grid grid-rows-[1fr_auto] items-center gap-4', hasNoCash && 'grid-rows-1')}>{children}</div>
  )
}
