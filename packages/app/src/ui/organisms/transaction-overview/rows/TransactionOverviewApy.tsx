import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { testIds } from '@/ui/utils/testIds'

export interface TransactionOverviewApyProps {
  apy: Percentage
  rewardsPerYear: NormalizedUnitNumber
  rewardToken: Token
}

export function TransactionOverviewApy({ apy, rewardsPerYear, rewardToken }: TransactionOverviewApyProps) {
  return (
    <div className="flex items-baseline gap-2">
      {apy.gt(0) && (
        <div
          data-testid={testIds.farmDetails.stakeDialog.transactionOverview.estimatedRewards.apy}
          className="typography-label-4 text-primary"
        >
          {formatPercentage(apy)}
        </div>
      )}
      <div
        className="typography-body-6 text-secondary"
        data-testid={testIds.farmDetails.stakeDialog.transactionOverview.estimatedRewards.description}
      >
        Earn ~{rewardToken.format(rewardsPerYear, { style: 'auto' })} {rewardToken.symbol}/year
      </div>
    </div>
  )
}
