import { MAINNET_USDS_SKY_FARM_ADDRESS } from '@/config/chain/constants'
import { Farm } from '@/domain/farms/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'
import { mockChartData } from '../fixtures/mockChartData'
import { FarmHistoryQueryResult } from '../logic/historic/useFarmHistory'
import { FarmDetailsView } from './FarmDetailsView'

const mockFarm = {
  blockchainInfo: {
    address: MAINNET_USDS_SKY_FARM_ADDRESS,
    name: 'SKY Farm',
    rewardType: 'token',
    entryAssetsGroup: {
      type: 'stablecoins',
      name: 'Stablecoins',
      assets: [tokens.DAI.symbol, tokens.sDAI.symbol, tokens.USDC.symbol, tokens.USDS.symbol, tokens.sUSDS.symbol],
    },
    rewardToken: tokens.SKY,
    stakingToken: tokens.USDS,
    earned: NormalizedUnitNumber(71.2345783),
    staked: NormalizedUnitNumber(10_000),
    rewardRate: NormalizedUnitNumber(0.0000000003756),
    earnedTimestamp: 1724337615,
    periodFinish: 2677721600,
    totalSupply: NormalizedUnitNumber(100_000),
  },
  apiInfo: {
    isPending: false,
    isError: false,
    error: null,
    data: {
      address: MAINNET_USDS_SKY_FARM_ADDRESS,
      apy: Percentage(0.05),
      totalRewarded: NormalizedUnitNumber(24520),
      depositors: 6,
    },
  },
} satisfies Farm

const meta: Meta<typeof FarmDetailsView> = {
  title: 'Features/FarmDetails/Views/FarmDetailsView',
  component: FarmDetailsView,
  decorators: [WithTooltipProvider(), withRouter],
  args: {
    chainId: 1,
    chainMismatch: false,
    walletConnected: true,
    farm: mockFarm,
    isFarmActive: true,
    canClaim: true,
    tokensToDeposit: [
      {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(10_000),
      },
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(20_864.56),
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.sDAI,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.sUSDS,
        balance: NormalizedUnitNumber(0),
      },
    ],
    calculateReward: () => NormalizedUnitNumber(71.2345783),
    openStakeDialog: () => {},
    openConnectModal: () => {},
    openSandboxModal: () => {},
    chartDetails: {
      farmHistory: { data: mockChartData } as FarmHistoryQueryResult,
      onTimeframeChange: () => {},
      timeframe: 'All',
    },
  },
}

export default meta
type Story = StoryObj<typeof FarmDetailsView>

export const ActiveDesktop: Story = {}
export const ActiveMobile = getMobileStory(ActiveDesktop)
export const ActiveTablet = getTabletStory(ActiveDesktop)

export const NoDepositWithRewards: Story = {
  args: {
    farm: {
      ...mockFarm,
      blockchainInfo: {
        ...mockFarm.blockchainInfo,
        staked: NormalizedUnitNumber(0),
      },
    },
  },
}
export const NoDepositWithRewardsMobile = getMobileStory(NoDepositWithRewards)
export const NoDepositWithRewardsTablet = getTabletStory(NoDepositWithRewards)

export const InactiveDesktop: Story = {
  args: {
    farm: {
      ...mockFarm,
      blockchainInfo: {
        ...mockFarm.blockchainInfo,
        earned: NormalizedUnitNumber(0),
        staked: NormalizedUnitNumber(0),
      },
    },
    isFarmActive: false,
  },
}
export const InactiveMobile = getMobileStory(InactiveDesktop)
export const InactiveTablet = getTabletStory(InactiveDesktop)

export const NotConnectedDesktop: Story = {
  args: {
    farm: {
      ...mockFarm,
      blockchainInfo: {
        ...mockFarm.blockchainInfo,
        earned: NormalizedUnitNumber(0),
        staked: NormalizedUnitNumber(0),
      },
    },
    isFarmActive: false,
    walletConnected: false,
  },
}
export const NotConnectedMobile = getMobileStory(NotConnectedDesktop)
export const NotConnectedTablet = getTabletStory(NotConnectedDesktop)

export const ActiveDesktopChainMismatch: Story = {
  args: {
    chainMismatch: true,
  },
}
