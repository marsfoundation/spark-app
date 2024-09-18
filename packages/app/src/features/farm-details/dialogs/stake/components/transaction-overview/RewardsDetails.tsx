import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { testIds } from '@/ui/utils/testIds'

export interface RewardsDetailsProps {
  rewardRate: NormalizedUnitNumber
  rewardToken: Token
  apy: Percentage
}

export function RewardsDetails({ apy, rewardToken, rewardRate }: RewardsDetailsProps) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div data-testid={testIds.dialog.savings.transactionOverview.apy.value}>{formatPercentage(apy)}</div>
      <div
        className="text-basics-dark-grey text-sm"
        data-testid={testIds.dialog.savings.transactionOverview.apy.description}
      >
        <span className="hidden sm:inline">Earn </span>~{rewardToken.format(rewardRate, { style: 'auto' })}{' '}
        {rewardToken.symbol}/year
      </div>
    </div>
  )
}
