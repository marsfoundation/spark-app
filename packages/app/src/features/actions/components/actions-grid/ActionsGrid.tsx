import { cva } from 'class-variance-authority'
import { ReactNode } from 'react'
import { ActionsGridLayout } from '../../types'

export interface ActionsGridProps {
  children: ReactNode
  layout: ActionsGridLayout
}

export function ActionsGrid({ children, layout }: ActionsGridProps) {
  return <div className={actionGridVariants({ layout })}>{children}</div>
}

export const actionGridVariants = cva(
  'grid grid-cols-[auto_1fr_auto] gap-x-3 rounded-xs border border-primary sm:gap-x-8',
  {
    variants: {
      layout: {
        compact: 'md:grid-cols-[auto_auto_1fr_auto]',
        extended: 'md:grid-cols-[auto_auto_auto_1fr_auto]',
      },
    },
  },
)
