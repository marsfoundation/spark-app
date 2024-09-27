import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { ActiveFarmInfoPanel } from './ActiveFarmInfoPanel'

const meta: Meta<typeof ActiveFarmInfoPanel> = {
  title: 'Features/FarmDetails/Components/ActiveFarmInfoPanel',
  component: ActiveFarmInfoPanel,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
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
      rewardRate: NormalizedUnitNumber(0.0000000003756),
      earnedTimestamp: 1724337615,
      periodFinish: 2677721600,
      totalSupply: NormalizedUnitNumber(100_000),
      depositors: 6,
    },
  },
}

export default meta
type Story = StoryObj<typeof ActiveFarmInfoPanel>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
