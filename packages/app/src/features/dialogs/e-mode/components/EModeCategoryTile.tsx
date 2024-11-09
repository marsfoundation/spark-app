import { getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { cn } from '@/ui/utils/style'

import { Badge } from '@/ui/atoms/new/badge/Badge'
import { EModeCategory } from '../types'

interface EModeCategoryTileProps {
  eModeCategory: EModeCategory
}

export function EModeCategoryTile({ eModeCategory }: EModeCategoryTileProps) {
  if (eModeCategory.tokens.length === 0) {
    return null
  }

  const iconPaths = eModeCategory.tokens.map(({ symbol }) => getTokenImage(symbol))
  const variant = eModeCategory.isActive ? 'active' : 'inactive'

  return (
    <button
      onClick={eModeCategory.onSelect}
      className={cn(
        'flex w-full flex-col items-start text-start outline outline-2 outline-primary',
        'h-28 justify-between rounded-lg bg-primary p-2 sm:h-32 sm:p-4',
        'transition-colors duration-200 hover:bg-reskin-neutral-50/50 hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reskin-orange-200',
      )}
    >
      <Badge
        variant={variant === 'active' ? 'success' : 'neutral'}
        className={cn(variant === 'inactive' && 'opacity-40')}
        appearance="soft"
        size="sm"
      >
        {variant === 'active' ? 'Active' : 'Inactive'}
      </Badge>
      <h4 className="typography-label-3">{eModeCategory.name}</h4>
      <IconStack paths={iconPaths} maxIcons={4} />
    </button>
  )
}
