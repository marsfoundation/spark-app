import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'

export interface DSRBadgeProps {
  dsr?: Percentage
  isLoading: boolean
}

export function DSRBadge({ dsr, isLoading }: DSRBadgeProps) {
  // @note: The colors are hardcoded because it looks like this is the only place where these specific colors are used.
  return (
    <div className="flex h-8 w-fit flex-col justify-center rounded-2xl border border-[#3E8545]/10 bg-[#BBDEBE]/40 px-2.5 font-semibold text-[#3E8545]">
      {isLoading ? (
        <Skeleton className="h-5 w-7 bg-[#3E8545]/20" />
      ) : (
        dsr && formatPercentage(dsr, { minimumFractionDigits: 0 })
      )}
    </div>
  )
}
