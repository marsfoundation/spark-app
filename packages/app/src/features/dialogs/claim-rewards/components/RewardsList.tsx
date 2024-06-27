import { Reward } from '@/features/navbar/components/rewards-badge/types'
import { getTokenImage } from '@/ui/assets'
import { cn } from '@/ui/utils/style'

export interface RewardsListProps {
  rewards: Reward[]
  className?: string
}

export function RewardsList({ rewards, className }: RewardsListProps) {
  return (
    <div className={cn('flex flex-col items-stretch', className)}>
      {rewards.map(({ token, amount }) => (
        <div
          key={token.symbol}
          className="flex items-center justify-between border-b py-4 text-base text-basics-black last:border-none"
        >
          <div className="flex items-center gap-1.5">
            <img src={getTokenImage(token.symbol)} className="h-7 lg:h-6" />
            {token.symbol}
          </div>
          <div className="flex flex-col items-end">
            {token.format(amount, { style: 'auto' })}
            <div className="text-prompt-foreground text-xs">~{token.formatUSD(amount)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
