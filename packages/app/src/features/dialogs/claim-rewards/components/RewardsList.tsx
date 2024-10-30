import { Reward } from '@/features/navbar/components/rewards-badge/types'
import { getTokenImage } from '@/ui/assets'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

export interface RewardsListProps {
  rewards: Reward[]
  className?: string
}

export function RewardsList({ rewards, className }: RewardsListProps) {
  return (
    <div className={cn('flex flex-col items-stretch', className)}>
      {rewards.map(({ token, amount }, index) => (
        <div
          key={token.symbol}
          className="flex items-center justify-between border-b py-4 text-base last:border-none"
          data-testid={testIds.dialog.claimRewards.transactionOverview.row(index)}
        >
          <div className="flex items-center gap-1.5">
            <img src={getTokenImage(token.symbol)} className="h-7 lg:h-6" />
            <div data-testid={testIds.dialog.claimRewards.transactionOverview.token}> {token.symbol} </div>
          </div>
          <div className="flex flex-col items-end">
            <div data-testid={testIds.dialog.claimRewards.transactionOverview.amount}>
              {token.format(amount, { style: 'auto' })}{' '}
            </div>
            <div
              className="text-prompt-foreground text-xs"
              data-testid={testIds.dialog.claimRewards.transactionOverview.amountUSD}
            >
              ~{token.formatUSD(amount)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
