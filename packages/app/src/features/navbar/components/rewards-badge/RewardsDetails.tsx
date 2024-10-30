import { getTokenImage } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { testIds } from '@/ui/utils/testIds'
import { Reward } from './types'

export interface RewardsDetailsProps {
  rewards: Reward[]
  onClaim: () => void
}

export function RewardsDetails({ rewards, onClaim }: RewardsDetailsProps) {
  return (
    <div
      className="flex w-[calc(100vw-48px)] min-w-72 flex-col gap-4 p-4 text-basics-dark-grey text-xs lg:w-auto"
      data-testid={testIds.navbar.rewards.details.tooltip}
    >
      <div className="flex flex-col gap-2 border-basics-grey/50 border-b pb-4">
        Rewards
        <div className="flex flex-col items-stretch gap-3">
          {rewards.map(({ token, amount }, index) => (
            <div
              key={token.symbol}
              className="flex items-center justify-between"
              data-testid={testIds.navbar.rewards.details.row(index)}
            >
              <div className="flex items-center gap-2">
                <img src={getTokenImage(token.symbol)} className="h-7 lg:h-6" />
                <div className="font-semibold text-base tabular-nums">
                  <span data-testid={testIds.navbar.rewards.details.amount}>
                    {token.format(amount, { style: 'auto' })}
                  </span>{' '}
                  <span data-testid={testIds.navbar.rewards.details.token}>{token.symbol}</span>
                </div>
              </div>
              <div data-testid={testIds.navbar.rewards.details.amountUSD}>{token.formatUSD(amount)}</div>
            </div>
          ))}
        </div>
      </div>
      <Button className="w-full" onClick={onClaim}>
        Claim rewards
      </Button>
    </div>
  )
}
