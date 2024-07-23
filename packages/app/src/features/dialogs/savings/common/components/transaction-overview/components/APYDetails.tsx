import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { testIds } from '@/ui/utils/testIds'

export interface APYDetailsProps {
  dai: Token
  APY: Percentage
  daiEarnRate: NormalizedUnitNumber
}

export function APYDetails({ dai, APY, daiEarnRate }: APYDetailsProps) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div data-testid={testIds.dialog.savings.nativeRouteTransactionOverview.apy.value}>{formatPercentage(APY)}</div>
      <div
        className="text-basics-dark-grey text-sm"
        data-testid={testIds.dialog.savings.nativeRouteTransactionOverview.apy.description}
      >
        ~{dai.format(daiEarnRate, { style: 'auto' })} {dai.symbol} per year
      </div>
    </div>
  )
}
