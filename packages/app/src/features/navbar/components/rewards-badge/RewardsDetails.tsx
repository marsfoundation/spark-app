import { getTokenImage } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { Reward } from './types'

export interface RewardsDetailsProps {
  rewards: Reward[]
  isLoading: boolean
}

export function RewardsDetails({ rewards, isLoading }: RewardsDetailsProps) {
  return (
    <div className="flex min-w-72 flex-col gap-4 p-4 text-basics-dark-grey text-xs">
      <div className="flex flex-col gap-2 border-basics-grey/50 border-b pb-4">
        Rewards
        <div className="flex flex-col items-stretch gap-3">
          {isLoading && <Skeleton className="h-7 w-full" />}
          {!isLoading &&
            rewards.map(({ token, amount }) => (
              <div key={token.symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={getTokenImage(token.symbol)} className="h-7 lg:h-6" />
                  <div className="font-semibold text-base text-basics-black tabular-nums">
                    {token.format(amount, { style: 'auto' })} {token.symbol}
                  </div>
                </div>
                {token.formatUSD(amount)}
              </div>
            ))}
        </div>
      </div>
      <Button className="w-full" disabled={isLoading}>
        Claim rewards
      </Button>
    </div>
  )
}
