import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

export interface FarmDestinationRouteItemProps {
  entryToken: TokenSymbol
  rewardsToken: TokenSymbol
  displayRouteVertically: boolean
}
export function FarmDestinationRouteItem({
  rewardsToken,
  entryToken,
  displayRouteVertically,
}: FarmDestinationRouteItemProps) {
  return (
    <div className={cn('grid grid-cols-1 items-center gap-x-2 gap-y-0.5')}>
      <div data-testid={testIds.farmDetails.dialog.transactionOverview.farmDestinationRouteItem.farmName}>
        {rewardsToken} Farm
      </div>
      <div
        className={cn('justify-self-end text-basics-dark-grey text-sm', !displayRouteVertically && 'md:order-last')}
        data-testid={testIds.farmDetails.dialog.transactionOverview.farmDestinationRouteItem.entryToken}
      >
        {entryToken} Staked
      </div>
    </div>
  )
}
