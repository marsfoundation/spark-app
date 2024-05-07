import { cva } from 'class-variance-authority'

import { eModeCategoryIdToName } from '@/domain/e-mode/constants'
import { EModeCategoryId, EModeCategoryName } from '@/domain/e-mode/types'
import Flash from '@/ui/assets/flash.svg?react'
import { cn } from '@/ui/utils/style'

export type EnabledEModeCategory = Exclude<EModeCategoryName, 'No E-Mode'>
export interface EModeBadgeProps {
  categoryId: EModeCategoryId
  asButton?: boolean
}

export function EModeBadge({ categoryId, asButton }: EModeBadgeProps) {
  const text = eModeCategoryIdToName[categoryId]
  const state = categoryId === 0 ? 'off' : 'on'
  const Component = asButton ? 'button' : 'div'

  return (
    <Component className={cn(variants({ state, asButton }))}>
      {categoryId !== 0 && <Flash className="h-3.5 w-3.5" />}
      {text}
    </Component>
  )
}

const variants = cva(
  'flex w-fit flex-row items-center gap-1.5 rounded-sm border px-1 py-0.5 text-xs font-semibold uppercase',
  {
    variants: {
      state: {
        on: 'border-spark bg-spark/10 text-spark',
        off: 'border-basics-dark-grey/30 text-basics-dark-grey/80',
      },
      asButton: {
        true: 'cursor-pointer transition duration-150 hover:brightness-[0.85]',
      },
    },
    compoundVariants: [
      {
        state: 'off',
        asButton: true,
        className: 'hover:bg-basics-dark-grey/5',
      },
    ],
  },
)
