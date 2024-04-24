import { cva } from 'class-variance-authority'

import { getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { cn } from '@/ui/utils/style'

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
        'border-basics-border flex w-full flex-col items-start text-start',
        'bg-basics-white h-28 justify-between rounded-xl border p-2 sm:h-32 sm:p-4',
        'hover:bg-basics-light-grey transition-colors duration-200 hover:shadow-sm',
        eModeCategory.isSelected && 'border-main-blue',
      )}
    >
      <h4 className={headerVariants({ variant })}>{eModeCategory.name}</h4>
      <IconStack paths={iconPaths} maxIcons={4} />
      <ActivityBadge variant={variant} />
    </button>
  )
}

function ActivityBadge({ variant }: { variant: 'active' | 'inactive' }) {
  return <div className={activityBadgeVariants({ variant })}>{variant === 'active' ? 'Active' : 'Inactive'}</div>
}

const activityBadgeVariants = cva('rounded-lg px-2.5 py-1.5 text-xs font-semibold leading-none tracking-wide', {
  variants: {
    variant: {
      inactive: 'bg-basics-dark-grey/10 text-basics-dark-grey',
      active: 'bg-basics-green/10 text-basics-green',
    },
  },
})

const headerVariants = cva('text-xs font-semibold sm:text-base', {
  variants: {
    variant: {
      active: 'text-basics-black',
      inactive: 'text-basics-dark-grey',
    },
  },
})
