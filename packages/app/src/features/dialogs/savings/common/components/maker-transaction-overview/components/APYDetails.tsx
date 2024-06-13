import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { testIds } from '@/ui/utils/testIds'

export interface APYDetailsProps {
  APY: Percentage
  daiEarnRate: NormalizedUnitNumber
}

export function APYDetails({ APY, daiEarnRate }: APYDetailsProps) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div data-testid={testIds.dialog.savings.nativeRouteTransactionOverview.apy.value}>{formatPercentage(APY)}</div>
      <div
        className="text-basics-dark-grey text-sm"
        data-testid={testIds.dialog.savings.nativeRouteTransactionOverview.apy.description}
      >
        ~{USD_MOCK_TOKEN.format(daiEarnRate, { style: 'auto' })} DAI per year
      </div>
    </div>
  )
}
