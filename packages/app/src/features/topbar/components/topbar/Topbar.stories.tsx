import { paths } from '@/config/paths'
import { assets } from '@/ui/assets'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { reactRouterParameters, withRouter } from 'storybook-addon-remix-react-router'
import { mainnet } from 'viem/chains'
import { Topbar, TopbarProps } from './Topbar'

const args = {
  menuInfo: {
    isInSandbox: false,
    onSandboxModeClick: () => {},
    buildInfo: {
      sha: 'bdebc69',
      buildTime: '25/10/2024, 10:01:51',
    },
    isMobileDisplay: false,
    rewardsInfo: {
      rewards: [
        {
          token: tokens.wstETH,
          amount: NormalizedUnitNumber(0.00157),
        },
        {
          token: tokens.WBTC,
          amount: NormalizedUnitNumber(0.0003498),
        },
      ],
      onClaim: () => {},
      totalClaimableReward: NormalizedUnitNumber(0.0029198),
    },
    airdropInfo: {
      airdrop: {
        tokenReward: NormalizedUnitNumber(1200345.568),
        tokenRatePerSecond: NormalizedUnitNumber(1),
        tokenRatePrecision: 1,
        refreshIntervalInMs: 100,
        timestampInMs: Date.now() - 30 * 1000,
      },
      isLoading: false,
      isError: false,
    },
  },
  walletInfo: {
    connectedWalletInfo: {
      dropdownTriggerInfo: {
        mode: 'connected',
        avatar: assets.walletIcons.default,
        address: CheckedAddress('0x1234567890123456789012345678901234567890'),
      },
      dropdownContentInfo: {
        walletIcon: assets.walletIcons.metamask,
        address: CheckedAddress('0x1234567890123456789012345678901234567890'),
        onDisconnect: () => {},
        blockExplorerAddressLink: '/',
      },
      isMobileDisplay: false,
    },
    onConnect: () => {},
  },
  navigationInfo: {
    borrowSubLinks: [
      {
        to: paths.easyBorrow,
        label: 'Borrow DAI',
      },
      {
        to: paths.myPortfolio,
        label: 'My portfolio',
      },
      {
        to: paths.markets,
        label: 'Markets',
      },
    ],
    isBorrowSubLinkActive: false,
    blockedPages: [],
    savingsInfo: {
      data: {
        apy: Percentage(0.05),
      } as any,
      isLoading: false,
    },
  },
  networkInfo: {
    currentChain: {
      id: mainnet.id,
      name: 'Ethereum Mainnet',
    },
    onSelectNetwork: () => {},
  },
  rewardsInfo: {
    rewards: [
      {
        token: tokens.wstETH,
        amount: NormalizedUnitNumber(0.00157),
      },
      {
        token: tokens.WBTC,
        amount: NormalizedUnitNumber(0.0003498),
      },
    ],
    onClaim: () => {},
    totalClaimableReward: NormalizedUnitNumber(0.0029198),
  },
  airdropInfo: {
    airdrop: {
      tokenReward: NormalizedUnitNumber(1200345.568),
      tokenRatePerSecond: NormalizedUnitNumber(1),
      tokenRatePrecision: 1,
      refreshIntervalInMs: 100,
      timestampInMs: Date.now() - 30 * 1000,
    },
    isLoading: false,
    isError: false,
  },
  isMobileDisplay: false,
} satisfies TopbarProps

const meta: Meta<typeof Topbar> = {
  title: 'Features/Topbar/Components/Topbar',
  decorators: [WithTooltipProvider(), withRouter],
  component: Topbar,
  args,
  parameters: {
    layout: 'fullscreen',
    reactRouter: reactRouterParameters({
      routing: {
        path: paths.savings,
      },
    }),
  },
}

export default meta
type Story = StoryObj<typeof Topbar>

export const Default: Story = {}

export const Mobile = getMobileStory({
  args: {
    menuInfo: {
      ...args.menuInfo,
      isMobileDisplay: true,
    },
    walletInfo: {
      ...args.walletInfo,
      connectedWalletInfo: {
        ...args.walletInfo.connectedWalletInfo,
        isMobileDisplay: true,
      },
    },
    isMobileDisplay: true,
  },
})
