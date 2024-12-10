import { formatPercentage } from '@/domain/common/format'
import { Token } from '@/domain/types/Token'
import { HorizontalScroll } from '@/ui/atoms/horizontal-scroll/HorizontalScroll'
import { testIds } from '@/ui/utils/testIds'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'

export interface TransactionOverviewSavingsApyProps {
  apy: Percentage
  stableEarnRate: NormalizedUnitNumber
  baseStable: Token
}

export function TransactionOverviewSavingsApy({ apy, stableEarnRate, baseStable }: TransactionOverviewSavingsApyProps) {
  return (
    <HorizontalScroll>
      <div className="flex items-baseline gap-2">
        {apy.gt(0) && (
          <div
            data-testid={testIds.dialog.savings.transactionOverview.apy.value}
            className="typography-label-2 text-primary"
          >
            {formatPercentage(apy)}
          </div>
        )}
        <div
          className="typography-body-4 text-secondary"
          data-testid={testIds.dialog.savings.transactionOverview.apy.description}
        >
          Earn ~{baseStable.format(stableEarnRate, { style: 'auto' })} {baseStable.symbol}/year
        </div>
      </div>
    </HorizontalScroll>
  )
}
