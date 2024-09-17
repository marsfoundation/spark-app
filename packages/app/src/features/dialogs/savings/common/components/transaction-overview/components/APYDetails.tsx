import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { testIds } from '@/ui/utils/testIds'

export interface APYDetailsProps {
  baseStable: Token
  APY: Percentage
  stableEarnRate: NormalizedUnitNumber
}

export function APYDetails({ baseStable, APY, stableEarnRate }: APYDetailsProps) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div data-testid={testIds.dialog.savings.transactionOverview.apy.value}>{formatPercentage(APY)}</div>
      <div
        className="text-basics-dark-grey text-sm"
        data-testid={testIds.dialog.savings.transactionOverview.apy.description}
      >
        ~{baseStable.format(stableEarnRate, { style: 'auto' })} {baseStable.symbol} per year
      </div>
    </div>
  )
}
