import { TopbarMenu, TopbarMenuProps } from '@/features/topbar/components/topbar-menu/TopbarMenu'
import {
  TopbarNavigation,
  TopbarNavigationProps,
} from '@/features/topbar/components/topbar-navigation/TopbarNavigation'
import { TopbarNetwork, TopbarNetworkProps } from '@/features/topbar/components/topbar-network/TopbarNetwork'
import { TopbarWallet, TopbarWalletProps } from '@/features/topbar/components/topbar-wallet/TopbarWallet'
import { assets } from '@/ui/assets'
import { cn } from '@/ui/utils/style'
import { Link } from 'react-router-dom'
import { TopbarAirdrop, TopbarAirdropProps } from '../topbar-airdrop/TopbarAirdrop'
import { TopbarNavigationDialog } from '../topbar-navigation/TopbarNavigationDialog'
import { TopbarRewards, TopbarRewardsProps } from '../topbar-rewards/TopbarRewards'
import { TopbarSparkRewards } from '../topbar-spark-rewards/TopbarSparkRewards'

export interface TopbarProps {
  walletInfo: TopbarWalletProps
  menuInfo: TopbarMenuProps
  navigationInfo: TopbarNavigationProps
  networkInfo: TopbarNetworkProps
  airdropInfo: TopbarAirdropProps
  rewardsInfo: TopbarRewardsProps
  isMobileDisplay: boolean
}

export function Topbar({
  walletInfo,
  menuInfo,
  navigationInfo,
  networkInfo,
  rewardsInfo,
  airdropInfo,
  isMobileDisplay,
}: TopbarProps) {
  const boxClasses = 'p-2 lg:p-3 rounded-md bg-primary/60 backdrop-blur-lg'

  return (
    <nav className="grid h-100% grid-cols-[1fr_auto] place-items-center gap-2 sm:grid-cols-[auto_1fr_auto]">
      <div className={cn(boxClasses, 'flex h-full w-full items-center gap-1 p-0 md:w-auto lg:p-0')}>
        <Link
          to="/"
          className={cn(
            'group focus-visible:bg-primary focus-visible:text-neutral-950 focus-visible:ring',
            'focus-visible:outline-none focus-visible:ring-primary-200 focus-visible:ring-offset-0',
            'flex h-14 w-10 shrink-0 items-center justify-center gap-2 sm:w-16',
          )}
        >
          <img
            src={assets.brand.symbolGradient}
            alt="Spark logo"
            className="aspect-square h-6 select-none brightness-0 transition duration-300 group-hover:filter-none group-focus-visible:filter-none sm:h-8 md:h-9"
          />
        </Link>
        {isMobileDisplay && <TopbarNavigationDialog {...navigationInfo} />}
      </div>

      <div className={cn(boxClasses, 'hidden h-full w-full justify-between gap-2 sm:flex')}>
        <TopbarNavigation {...navigationInfo} />
        <div className="flex gap-2">
          <TopbarSparkRewards />
          <TopbarRewards {...rewardsInfo} />
          <TopbarAirdrop {...airdropInfo} />
        </div>
      </div>

      <div className={cn(boxClasses, 'flex flex-nowrap justify-end gap-2 ')}>
        <TopbarNetwork {...networkInfo} />
        <TopbarWallet {...walletInfo} />
        <TopbarMenu {...menuInfo} />
      </div>
    </nav>
  )
}
