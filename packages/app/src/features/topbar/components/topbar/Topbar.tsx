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
import { TopbarRewards, TopbarRewardsProps } from '../topbar-rewards/TopbarRewards'

export interface TopbarProps {
  walletInfo: TopbarWalletProps
  menuInfo: TopbarMenuProps
  navigationInfo: TopbarNavigationProps
  networkInfo: TopbarNetworkProps
  airdropInfo: TopbarAirdropProps
  rewardsInfo: TopbarRewardsProps
}

export function Topbar({ walletInfo, menuInfo, navigationInfo, networkInfo, rewardsInfo, airdropInfo }: TopbarProps) {
  const boxClasses = 'p-3 rounded-md bg-primary/60 backdrop-blur-lg'

  return (
    <nav className="grid h-100% grid-cols-[auto_1fr_auto] place-items-center gap-2">
      <Link
        to="/"
        className={cn(
          boxClasses,
          'group focus-visible:bg-reskin-base-white focus-visible:text-reskin-neutral-950 focus-visible:ring',
          'focus-visible:outline-none focus-visible:ring-reskin-primary-200 focus-visible:ring-offset-0',
        )}
      >
        <img
          src={assets.brand.symbolGradient}
          alt="Spark logo"
          className="h-9 brightness-0 transition duration-300 group-focus-visible:filter-none group-hover:filter-none"
        />
      </Link>

      <div className={cn(boxClasses, 'flex w-full justify-between gap-2')}>
        <TopbarNavigation {...navigationInfo} />
        <div className="flex gap-2">
          <TopbarRewards {...rewardsInfo} />
          <TopbarAirdrop {...airdropInfo} />
        </div>
      </div>

      <div className={cn(boxClasses, 'flex flex-nowrap gap-2')}>
        <TopbarNetwork {...networkInfo} />
        <TopbarWallet {...walletInfo} />
        <TopbarMenu {...menuInfo} />
      </div>
    </nav>
  )
}
