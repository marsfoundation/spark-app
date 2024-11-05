import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { HorizontalScroll } from '@/ui/atoms/new/horizontal-scroll/HorizontalScroll'
import { testIds } from '@/ui/utils/testIds'

export interface TransactionOverviewFarmApyProps {
  apy: Percentage
  rewardsPerYear: NormalizedUnitNumber
  rewardToken: Token
}

export function TransactionOverviewFarmApy({ apy, rewardsPerYear, rewardToken }: TransactionOverviewFarmApyProps) {
  return (
    <HorizontalScroll>
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
    </HorizontalScroll>
  )
}
