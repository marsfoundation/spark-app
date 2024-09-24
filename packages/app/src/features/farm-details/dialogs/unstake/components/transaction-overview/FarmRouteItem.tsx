import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { assets } from '@/ui/assets'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

export interface FarmRouteItemProps {
  stakingToken: TokenSymbol
  rewardsToken: TokenSymbol
  displayRouteVertically: boolean
}
export function FarmRouteItem({ rewardsToken, stakingToken, displayRouteVertically }: FarmRouteItemProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 items-center gap-x-2 gap-y-0.5',
        !displayRouteVertically && 'md:grid-cols-[auto_auto]',
      )}
    >
      <div
        className="justify-self-end"
        data-testid={testIds.farmDetails.stakeDialog.transactionOverview.route.destination.farmName}
      >
        {rewardsToken} Farm
      </div>
      <div
        className={cn('justify-self-end text-basics-dark-grey text-sm', !displayRouteVertically && 'md:order-last')}
        data-testid={testIds.farmDetails.stakeDialog.transactionOverview.route.destination.stakingToken}
      >
        {stakingToken} Staked
      </div>

      <img
        src={assets.arrowRight}
        className={cn(
          'mt-1.5 h-3.5 w-3.5 rotate-90 justify-self-end',
          !displayRouteVertically && 'md:mt-0 md:rotate-0',
        )}
      />
    </div>
  )
}
