import { getTokenImage } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { Reward } from './types'

export interface RewardsDetailsProps {
  rewards: Reward[]
}

export function RewardsDetails({ rewards }: RewardsDetailsProps) {
  return (
    <div className="flex w-[calc(100vw-48px)] min-w-72 flex-col gap-4 p-4 text-basics-dark-grey text-xs lg:w-auto">
      <div className="flex flex-col gap-2 border-basics-grey/50 border-b pb-4">
        Rewards
        <div className="flex flex-col items-stretch gap-3">
          {rewards.map(({ token, amount }) => (
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
      <Button className="w-full">Claim rewards</Button>
    </div>
  )
}
