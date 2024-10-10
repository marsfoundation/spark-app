import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokenWithoutPrice } from '@/domain/types/Token'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

export interface RewardsDetailsProps {
  rewardsPerYear: NormalizedUnitNumber
  rewardToken: TokenWithoutPrice
  rewardTokenPrice: NormalizedUnitNumber | undefined
  apy: Percentage | undefined
}

export function RewardsDetails({ apy, rewardToken, rewardsPerYear, rewardTokenPrice }: RewardsDetailsProps) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      {apy && (
        <div data-testid={testIds.farmDetails.stakeDialog.transactionOverview.estimatedRewards.apy}>
          {formatPercentage(apy)}
        </div>
      )}
      <div
        className={cn(apy && 'text-basics-dark-grey text-sm')}
        data-testid={testIds.farmDetails.stakeDialog.transactionOverview.estimatedRewards.description}
      >
        <span className="hidden sm:inline">Earn </span>~
        {rewardToken.format(rewardsPerYear, { style: 'auto', tokenUnitPriceOverride: rewardTokenPrice })}{' '}
        {rewardToken.symbol}/year
      </div>
    </div>
  )
}
