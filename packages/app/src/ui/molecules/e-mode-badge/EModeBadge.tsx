import { eModeCategoryIdToName } from '@/domain/e-mode/constants'
import { EModeCategoryId } from '@/domain/e-mode/types'
import Flash from '@/ui/assets/flash.svg?react'
import { Badge } from '@/ui/atoms/new/badge/Badge'

export interface EModeBadgeProps {
  categoryId: EModeCategoryId
}

export function EModeBadge({ categoryId }: EModeBadgeProps) {
  const text = categoryId === 0 ? 'E-Mode Off' : eModeCategoryIdToName[categoryId]
  const state = categoryId === 0 ? 'off' : 'on'

  return (
    <Badge variant={state === 'on' ? 'brand' : 'neutral'} size="xs" appearance="soft">
      {categoryId !== 0 && <Flash className="h-3.5 w-3.5" />}
      {text}
    </Badge>
  )
}
