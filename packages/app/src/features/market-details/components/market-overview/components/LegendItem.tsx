import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { VariantProps, cva } from 'class-variance-authority'
import { Circle } from 'lucide-react'
import React from 'react'

function Legend({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap justify-center gap-4">{children}</div>
}

interface LegendItemProps {
  variant: LegendItemVariant
  token: Token
  value: NormalizedUnitNumber
}

function LegendItem({ variant, token, value }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <LegendItemBadge variant={variant} />
      <div className="typography-label-5 text-primary-inverse">{token.formatUSD(value, { compact: true })}</div>
    </div>
  )
}

const legendItemBadgeVariants = cva('flex items-center gap-1 rounded-xs px-1.5 py-1', {
  variants: {
    variant: {
      borrowed: 'bg-[#F76D36]/15 text-feature-borrow-primary',
      'instantly-available': 'bg-[#0FEFC5]/25 text-reskin-fg-system-success-primary',
      'sky-capacity': 'bg-[#6A4DFF]/25 text-reskin-fg-brand-secondary',
    },
  },
})
type LegendItemVariant = NonNullable<VariantProps<typeof legendItemBadgeVariants>['variant']>

function LegendItemBadge({ variant }: { variant: LegendItemVariant }) {
  const badgeText: string = (() => {
    switch (variant) {
      case 'borrowed':
        return 'Borrowed'
      case 'instantly-available':
        return 'Instantly available'
      case 'sky-capacity':
        return 'Sky capacity'
    }
  })()

  return (
    <div className={legendItemBadgeVariants({ variant })}>
      <Circle size={6} fill="currentColor" />
      <div className="typography-label-6">{badgeText}</div>
    </div>
  )
}

Legend.Item = LegendItem

export { Legend }
