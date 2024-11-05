import { Reward } from '@/features/navbar/components/rewards-badge/types'
import { TokenAmount } from '@/ui/molecules/token-amount/TokenAmount'
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
          className="flex items-center justify-between border-b py-4 text-base text-basics-black last:border-none"
          data-testid={testIds.dialog.claimRewards.transactionOverview.row(index)}
        >
          <TokenAmount
            token={token}
            amount={amount}
            variant="horizontal"
            amountDataTestId={testIds.dialog.claimRewards.transactionOverview.amount}
            usdAmountDataTestId={testIds.dialog.claimRewards.transactionOverview.amountUSD}
          />
        </div>
      ))}
    </div>
  )
}
