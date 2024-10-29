import { farmAddresses } from '@/config/chain/constants'
import { Farm } from '@/domain/farms/types'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider } from '@storybook-config/decorators'
import { tokens } from '@storybook-config/tokens'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { mainnet } from 'viem/chains'
import { InactiveFarmInfoPanel } from './InactiveFarmInfoPanel'

const mockFarm: Farm = {
  address: farmAddresses[mainnet.id].skyUsds,
  apy: Percentage(0.05),
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
  totalRewarded: NormalizedUnitNumber(24520),
  earnedTimestamp: 1724337615,
  periodFinish: 2677721600,
  totalSupply: NormalizedUnitNumber(100_000),
  depositors: 6,
}

const meta: Meta<typeof InactiveFarmInfoPanel> = {
  title: 'Features/FarmDetails/Components/FarmInfoPanel/InactiveFarmInfoPanel',
  component: InactiveFarmInfoPanel,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
    assetsGroupType: 'stablecoins',
    farm: mockFarm,
    walletConnected: true,
    chainId: mainnet.id,
  },
}

export default meta
type Story = StoryObj<typeof InactiveFarmInfoPanel>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

export const ZeroApy: Story = {
  args: {
    farm: {
      ...mockFarm,
      apy: Percentage(0),
    },
  },
}
export const ZeroApyMobile = getMobileStory(ZeroApy)
export const ZeroApyTablet = getTabletStory(ZeroApy)

export const ChroniclePoints: Story = {
  args: {
    farm: {
      ...mockFarm,
      address: farmAddresses[mainnet.id].chroniclePoints,
      rewardType: 'points',
      rewardToken: tokens.CLE,
    },
  },
}
export const ChroniclePointsMobile = getMobileStory(ChroniclePoints)
export const ChroniclePointsTablet = getTabletStory(ChroniclePoints)
