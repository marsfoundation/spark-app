import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'

import { TransactionOverviewDetailsItem } from '../../common/components/TransactionOverviewDetailsItem'

interface LTVChangeProps {
  currentMaxLTV: Percentage
  updatedMaxLTV?: Percentage
}

export function LTVChange({ currentMaxLTV, updatedMaxLTV }: LTVChangeProps) {
  if (!updatedMaxLTV) {
    return (
      <TransactionOverviewDetailsItem label="Maximum LTV">
        {formatPercentage(currentMaxLTV)}
      </TransactionOverviewDetailsItem>
    )
  }

  return (
    <TransactionOverviewDetailsItem label="Maximum LTV">
      <div className="flex flex-row items-center gap-2">
        {formatPercentage(currentMaxLTV)}
        <img src={assets.arrowRight} />
        {formatPercentage(updatedMaxLTV)}
      </div>
    </TransactionOverviewDetailsItem>
  )
}
