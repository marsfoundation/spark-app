import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { assets, getTokenImage } from '@/ui/assets'
import HandCoinsIcon from '@/ui/assets/hand-coins.svg?react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/ui/atoms/dialog/Dialog'
import { MenuItem, MenuItemIcon } from '@/ui/atoms/new/menu-item/MenuItem'
import { ChevronRight } from 'lucide-react'
import { TopbarRewardsProps } from '../../topbar-rewards/TopbarRewards'

export function TopbarMenuRewardsItem({ onClaim, totalClaimableReward, rewards }: TopbarRewardsProps) {
  if (totalClaimableReward.isZero()) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MenuItem variant="secondary" asChild withSeparator>
          <button className="flex items-center gap-2 rounded-none p-6">
            <div className="flex flex-col items-start gap-2">
              <span className="typography-label-5 text-secondary">Rewards</span>
              <div className="flex items-center gap-2">
                <img src={assets.giftGradient} alt="Gift icon" className="icon-md" />
                {USD_MOCK_TOKEN.formatUSD(totalClaimableReward, { compact: true })}
              </div>
            </div>
            <MenuItemIcon icon={ChevronRight} className="icon-sm ml-auto" />
          </button>
        </MenuItem>
      </DialogTrigger>

      <DialogContent overlayVariant="default" contentVerticalPosition="bottom" className="gap-1.5 p-0">
        <DialogTitle className="border-primary border-b p-5 pt-6">Rewards</DialogTitle>

        {rewards.map(({ token, amount }) => (
          <MenuItem className="pointer-events-none justify-between p-6 py-3" key={token.symbol}>
            <div className="flex items-center gap-2">
              <img src={getTokenImage(token.symbol)} alt={`${token.symbol} icon`} className="h-6" />

              <div className="typography-label-4">
                {token.format(amount, { style: 'auto' })} {token.symbol}
              </div>
            </div>

            <div className="typography-label-6 text-secondary">{token.formatUSD(amount)}</div>
          </MenuItem>
        ))}

        <div className="border-primary border-t" />

        <MenuItem asChild>
          <button className="cursor-pointer p-6" onClick={onClaim}>
            <MenuItemIcon icon={HandCoinsIcon} />
            Claim rewards
          </button>
        </MenuItem>
      </DialogContent>
    </Dialog>
  )
}
