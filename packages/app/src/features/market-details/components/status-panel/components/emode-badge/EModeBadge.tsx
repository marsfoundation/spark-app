import { EModeCategoryName } from '@/domain/e-mode/types'
import { assets } from '@/ui/assets'
import { cn } from '@/ui/utils/style'

export type EnabledEModeCategory = Exclude<EModeCategoryName, 'No E-Mode'>
export interface EModeBadgeProps {
  category: EnabledEModeCategory
}

export function EModeBadge({ category }: EModeBadgeProps) {
  const text = eModeCategoryToText(category)

  return (
    <div
      className={cn(
        'flex w-fit flex-row items-center gap-1.5',
        'border-spark bg-spark/10 rounded-sm border px-1 py-0.5',
        'text-spark text-xs font-semibold uppercase',
      )}
    >
      <img src={assets.flash} alt="flash" className="h-3.5 w-3.5" />
      {text}
    </div>
  )
}

function eModeCategoryToText(category: EnabledEModeCategory): string {
  switch (category) {
    case 'ETH Correlated':
      return 'ETH Correlated'
    case 'Stablecoins':
      return 'Stablecoins'
  }
}
