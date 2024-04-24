import { cva, VariantProps } from 'class-variance-authority'

import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

type DetailsGridItemProps = (
  | { type: 'monetary'; value: NormalizedUnitNumber }
  | {
      type: 'percentage'
      value: Percentage
    }
) & { title: string; token: Token } & VariantProps<typeof titleVariants>

export function DetailsGridItem({ title, token, value, type, titleVariant }: DetailsGridItemProps) {
  return (
    <div className="flex justify-between sm:flex-col sm:justify-normal" role="listitem">
      <p className={titleVariants({ titleVariant })}>{title}</p>
      <p className="text-sm leading-none text-sky-950 sm:text-base">
        {type === 'monetary' ? token.formatUSD(value, { compact: true }) : formatPercentage(value)}
      </p>
    </div>
  )
}

const titleVariants = cva('text-sm leading-none sm:text-xs', {
  variants: {
    titleVariant: {
      gray: 'text-zinc-500',
      blue: 'text-product-blue',
      green: 'text-product-green',
      orange: 'text-product-orange',
    },
  },
  defaultVariants: {
    titleVariant: 'gray',
  },
})
