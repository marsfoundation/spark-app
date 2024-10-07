import { MAINNET_USDS_SKY_FARM_ADDRESS } from '@/config/chain/constants'
import { Farm } from '@/domain/farms/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { ActiveFarmInfoPanel } from './ActiveFarmInfoPanel'

const mockFarm: Farm = {
  address: MAINNET_USDS_SKY_FARM_ADDRESS,
  apy: Percentage(0.05),
  entryAssetsGroup: {
    type: 'stablecoins',
    name: 'Stablecoins',
    assets: [tokens.DAI.symbol, tokens.sDAI.symbol, tokens.USDC.symbol, tokens.USDS.symbol, tokens.sUSDS.symbol],
  },
  name: 'SKY Farm',
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
  rewardType: 'token',
}

const meta: Meta<typeof ActiveFarmInfoPanel> = {
  title: 'Features/FarmDetails/Components/FarmInfoPanel/ActiveFarmInfoPanel',
  component: ActiveFarmInfoPanel,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
    farm: mockFarm,
    canClaim: true,
    calculateReward: () => NormalizedUnitNumber(71.2345783),
  },
}

export default meta
type Story = StoryObj<typeof ActiveFarmInfoPanel>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

export const DesktopZeroAPY: Story = {
  args: {
    farm: {
      ...mockFarm,
      apy: Percentage(0),
    },
  },
}
export const DesktopPointsOutOfSync: Story = {
  args: {
    farm: {
      ...mockFarm,
      rewardToken: mockFarm.rewardToken.clone({ symbol: TokenSymbol('CLE'), unitPriceUsd: NormalizedUnitNumber(0) }),
      apy: Percentage(0),
      rewardType: 'points',
    },
    canClaim: false,
    pointsSyncStatus: 'out-of-sync',
  },
}
