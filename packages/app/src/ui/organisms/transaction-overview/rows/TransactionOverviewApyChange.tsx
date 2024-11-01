import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { MoveRightIcon } from 'lucide-react'

export interface TransactionOverviewApyChangeProps {
  currentApy: Percentage
  updatedApy: Percentage
}

export function TransactionOverviewApyChange({ currentApy, updatedApy }: TransactionOverviewApyChangeProps) {
  return (
    <div className="flex flex-row items-center gap-2">
      <div
        data-testid={testIds.dialog.savings.transactionOverview.apyChange.before}
        className="typography-label-4 text-primary"
      >
        {formatPercentage(currentApy)}
      </div>
      <MoveRightIcon size={12} className="text-secondary" />
      <div
        data-testid={testIds.dialog.savings.transactionOverview.apyChange.after}
        className={cn(
          'typography-label-4',
          currentApy.eq(updatedApy) && 'text-primary',
          currentApy.gt(updatedApy) && 'text-system-error-primary',
          currentApy.lt(updatedApy) && 'text-system-success-primary',
        )}
      >
        {formatPercentage(updatedApy)}
      </div>
    </div>
  )
}
