import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { testIds } from '@/ui/utils/testIds'

export interface RewardsDetailsProps {
  rewardsRate: NormalizedUnitNumber
  rewardsToken: Token
  apy: Percentage
}

export function RewardsDetails({ apy, rewardsToken, rewardsRate }: RewardsDetailsProps) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div data-testid={testIds.dialog.savings.transactionOverview.apy.value}>{formatPercentage(apy)}</div>
      <div
        className="text-basics-dark-grey text-sm"
        data-testid={testIds.dialog.savings.transactionOverview.apy.description}
      >
        Earn ~{rewardsToken.format(rewardsRate, { style: 'auto' })} {rewardsToken.symbol} per year
      </div>
    </div>
  )
}
