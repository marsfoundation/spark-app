import { cva } from 'class-variance-authority'

import { eModeCategoryIdToName } from '@/domain/e-mode/constants'
import { EModeCategoryId } from '@/domain/e-mode/types'
import Flash from '@/ui/assets/flash.svg?react'
import { cn } from '@/ui/utils/style'

export interface EModeBadgeProps {
  categoryId: EModeCategoryId
}

export function EModeBadge({ categoryId }: EModeBadgeProps) {
  const text = categoryId === 0 ? 'off' : eModeCategoryIdToName[categoryId]
  const state = categoryId === 0 ? 'off' : 'on'

  return (
    <div className={cn(variants({ state }))}>
      {categoryId !== 0 && <Flash className="h-3.5 w-3.5" />}
      {text}
    </div>
  )
}

const variants = cva(
  'flex w-fit flex-row items-center gap-1.5 rounded-sm border px-1 py-0.5 text-xs font-semibold uppercase',
  {
    variants: {
      state: {
        on: 'border-spark bg-spark/10 text-spark',
        off: 'border-basics-dark-grey/30 text-basics-dark-grey/80 bg-basics-light-grey/30',
      },
    },
  },
)
