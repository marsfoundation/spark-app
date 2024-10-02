import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'
import { mockChartData } from '../fixtures/mockChartData'
import { FarmHistoryQueryResult } from '../logic/historic/useFarmHistoryQuery'
import { FarmDetailsView } from './FarmDetailsView'

const meta: Meta<typeof FarmDetailsView> = {
  title: 'Features/FarmDetails/Views/FarmDetailsView',
  component: FarmDetailsView,
  decorators: [WithTooltipProvider(), withRouter],
  args: {
    chainId: 1,
    chainMismatch: false,
    walletConnected: true,
    farm: {
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
      apy: Percentage(0.05),
      entryAssetsGroup: {
        type: 'stablecoins',
        name: 'Stablecoins',
        assets: [tokens.DAI.symbol, tokens.sDAI.symbol, tokens.USDC.symbol, tokens.USDS.symbol, tokens.sUSDS.symbol],
      },
      rewardToken: tokens.SKY,
      stakingToken: tokens.USDS,
      earned: NormalizedUnitNumber(71.2345783),
      staked: NormalizedUnitNumber(10_000),
      totalRewarded: NormalizedUnitNumber(24520),
      rewardRate: NormalizedUnitNumber(0.0000000003756),
      earnedTimestamp: 1724337615,
      periodFinish: 2677721600,
      totalSupply: NormalizedUnitNumber(100_000),
      depositors: 6,
    },
    isFarmActive: true,
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
    openStakeDialog: () => {},
    openConnectModal: () => {},
    openSandboxModal: () => {},
    farmHistory: { data: mockChartData } as FarmHistoryQueryResult,
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
      address: CheckedAddress('0x56072C95FAA701256059aa122697B133aDEd9279'),
      apy: Percentage(0.05),
      entryAssetsGroup: {
        type: 'stablecoins',
        name: 'Stablecoins',
        assets: [tokens.DAI.symbol, tokens.sDAI.symbol, tokens.USDC.symbol, tokens.USDS.symbol, tokens.sUSDS.symbol],
      },
      rewardToken: tokens.SKY,
      stakingToken: tokens.USDS,
      earned: NormalizedUnitNumber(71.2345783),
      staked: NormalizedUnitNumber(0),
      rewardRate: NormalizedUnitNumber(0.0000000003756),
      totalRewarded: NormalizedUnitNumber(24520),
      earnedTimestamp: 1724337615,
      periodFinish: 2677721600,
      totalSupply: NormalizedUnitNumber(100_000),
      depositors: 6,
    },
  },
}
export const NoDepositWithRewardsMobile = getMobileStory(NoDepositWithRewards)
export const NoDepositWithRewardsTablet = getTabletStory(NoDepositWithRewards)

export const InactiveDesktop: Story = {
  args: {
    farm: {
      address: CheckedAddress('0x56072C95FAA701256059aa122697B133aDEd9279'),
      apy: Percentage(0.05),
      entryAssetsGroup: {
        type: 'stablecoins',
        name: 'Stablecoins',
        assets: [tokens.DAI.symbol, tokens.sDAI.symbol, tokens.USDC.symbol, tokens.USDS.symbol, tokens.sUSDS.symbol],
      },
      rewardToken: tokens.SKY,
      stakingToken: tokens.USDS,
      earned: NormalizedUnitNumber(0),
      staked: NormalizedUnitNumber(0),
      totalRewarded: NormalizedUnitNumber(24520),
      rewardRate: NormalizedUnitNumber(0.0000000003756),
      earnedTimestamp: 1724337615,
      periodFinish: 2677721600,
      totalSupply: NormalizedUnitNumber(100_000),
      depositors: 6,
    },
    isFarmActive: false,
  },
}
export const InactiveMobile = getMobileStory(InactiveDesktop)
export const InactiveTablet = getTabletStory(InactiveDesktop)

export const NotConnectedDesktop: Story = {
  args: {
    farm: {
      address: CheckedAddress('0x56072C95FAA701256059aa122697B133aDEd9279'),
      apy: Percentage(0.05),
      entryAssetsGroup: {
        type: 'stablecoins',
        name: 'Stablecoins',
        assets: [tokens.DAI.symbol, tokens.sDAI.symbol, tokens.USDC.symbol, tokens.USDS.symbol, tokens.sUSDS.symbol],
      },
      rewardToken: tokens.SKY,
      stakingToken: tokens.USDS,
      earned: NormalizedUnitNumber(0),
      staked: NormalizedUnitNumber(0),
      totalRewarded: NormalizedUnitNumber(24520),
      rewardRate: NormalizedUnitNumber(0.0000000003756),
      earnedTimestamp: 1724337615,
      periodFinish: 2677721600,
      totalSupply: NormalizedUnitNumber(100_000),
      depositors: 6,
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
