import { MAINNET_USDS_SKY_FARM_ADDRESS } from '@/config/chain/constants'
import { Farm } from '@/domain/farms/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { ActiveFarmInfoPanel } from './ActiveFarmInfoPanel'

const mockFarm = {
  blockchainDetails: {
    address: MAINNET_USDS_SKY_FARM_ADDRESS,
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
    rewardRate: NormalizedUnitNumber(0.0000000003756),
    earnedTimestamp: 1724337615,
    periodFinish: 2677721600,
    totalSupply: NormalizedUnitNumber(100_000),
    rewardType: 'token',
  },
  apiDetails: {
    isPending: false,
    isError: false,
    error: null,
    data: {
      address: MAINNET_USDS_SKY_FARM_ADDRESS,
      apy: Percentage(0.05),
      depositors: 6,
      totalRewarded: NormalizedUnitNumber(24520),
      rewardTokenPriceUsd: tokens.SKY.unitPriceUsd,
    },
  },
} satisfies Farm

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
      apiDetails: {
        ...mockFarm.apiDetails,
        data: {
          ...mockFarm.apiDetails.data,
          apy: Percentage(0),
        },
      },
    },
  },
}
export const DesktopPointsOutOfSync: Story = {
  args: {
    farm: {
      ...mockFarm,
      blockchainDetails: {
        ...mockFarm.blockchainDetails,
        rewardType: 'points',
        rewardToken: mockFarm.blockchainDetails.rewardToken.clone({
          symbol: TokenSymbol('CLE'),
          unitPriceUsd: NormalizedUnitNumber(0),
        }),
      },
      apiDetails: {
        ...mockFarm.apiDetails,
        data: {
          ...mockFarm.apiDetails.data,
          rewardTokenPriceUsd: undefined,
          apy: Percentage(0),
        },
      },
    },
    canClaim: false,
    pointsSyncStatus: 'out-of-sync',
  },
}
