import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'

export interface SavingsAPYBadgeProps {
  APY?: Percentage
  isLoading: boolean
}

export function SavingsAPYBadge({ APY, isLoading }: SavingsAPYBadgeProps) {
  return (
    <div className="inline-flex h-5 min-w-8 items-center justify-center rounded-md bg-gradient-savings px-1.5">
      {isLoading ? (
        <Skeleton className="h-4 w-5 rounded-sm bg-primary/80 backdrop-brightness-75" />
      ) : (
        APY && (
          <span className="typography-label-5 text-primary-inverse">
            {formatPercentage(APY, { minimumFractionDigits: 0 })}
          </span>
        )
      )}
    </div>
  )
}
