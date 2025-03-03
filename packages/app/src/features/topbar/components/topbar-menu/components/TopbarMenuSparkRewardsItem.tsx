import { paths } from '@/config/paths'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { MenuItem } from '@/ui/atoms/menu-item/MenuItem'
import { NavLink } from 'react-router-dom'
import { SparkRewardsSummary } from '../../../types'

export function TopbarMenuSparkRewardsItem({
  totalUsdAmount,
  closeMenu,
}: SparkRewardsSummary & { closeMenu: () => void }) {
  return (
    <MenuItem asChild withSeparator>
      <NavLink to={paths.sparkRewards} className="group" onClick={closeMenu}>
        <div className="flex flex-col items-start gap-2">
          <span className="typography-label-3 text-secondary">Spark Rewards</span>
          <div className="flex w-full items-center gap-2">
            <img src={assets.giftGradient} className="size-6" />
            <div>{totalUsdAmount ? USD_MOCK_TOKEN.formatUSD(totalUsdAmount) : 'No Rewards yet'}</div>
          </div>
        </div>
      </NavLink>
    </MenuItem>
  )
}
