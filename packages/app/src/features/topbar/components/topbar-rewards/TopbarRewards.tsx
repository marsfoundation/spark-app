import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token, USD_MOCK_TOKEN } from '@/domain/types/Token'
import { getTokenImage } from '@/ui/assets'
import HandCoins from '@/ui/assets/hand-coins.svg?react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemIcon,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'
import { Button, ButtonIcon } from '@/ui/atoms/new/button/Button'
import { testIds } from '@/ui/utils/testIds'
import { GiftIcon } from 'lucide-react'

export interface Reward {
  token: Token
  amount: NormalizedUnitNumber
}

export interface RewardsProps {
  rewards: Reward[]
  onClaim: () => void
}
export function TopbarRewards({ rewards, onClaim }: RewardsProps) {
  const totalClaimableReward = rewards.reduce(
    (acc, { token, amount }) => NormalizedUnitNumber(acc.plus(token.toUSD(amount))),
    NormalizedUnitNumber(0),
  )

  if (totalClaimableReward.isZero()) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-testid={testIds.navbar.rewards.badge} size="m" variant="tertiary">
          <ButtonIcon icon={GiftIcon} />
          <span data-testid={testIds.navbar.rewards.claimableRewards}>
            {USD_MOCK_TOKEN.formatUSD(totalClaimableReward, { compact: true })}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-1">
        <DropdownMenuGroup className="py-2">
          <DropdownMenuLabel data-testid={testIds.navbar.rewards.details.tooltip}>Rewards</DropdownMenuLabel>

          {rewards.map(({ token, amount }, index) => (
            <DropdownMenuItem
              className="pointer-events-none justify-between py-2"
              key={token.symbol}
              data-testid={testIds.navbar.rewards.details.row(index)}
            >
              <div className="flex items-center gap-2">
                <img src={getTokenImage(token.symbol)} alt={`${token.symbol} icon`} className="h-6" />

                <div className="typography-label-4">
                  <span data-testid={testIds.navbar.rewards.details.amount}>
                    {token.format(amount, { style: 'auto' })}
                  </span>{' '}
                  <span data-testid={testIds.navbar.rewards.details.token}>{token.symbol}</span>
                </div>
              </div>

              <div className="typography-label-6 text-secondary" data-testid={testIds.navbar.rewards.details.amountUSD}>
                {token.formatUSD(amount)}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button className="cursor-pointer" onClick={onClaim}>
            <DropdownMenuItemIcon icon={HandCoins} />
            Claim rewards
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
;<HandCoins />
