import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { ActiveFarmInfoPanel } from './ActiveFarmInfoPanel'

const meta: Meta<typeof ActiveFarmInfoPanel> = {
  title: 'Features/Farms/Components/ActiveFarmInfoPanel',
  component: ActiveFarmInfoPanel,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
    farmDetailsRowData: {
      depositors: 6,
      tvl: NormalizedUnitNumber(57_891),
      apy: Percentage(0.05),
    },
    farmExtendedInfo: {
      rewardToken: tokens.MKR,
      stakingToken: tokens.DAI,
      earned: NormalizedUnitNumber(71.2345783),
      staked: NormalizedUnitNumber(10_000),
      rewardRate: NormalizedUnitNumber(0.0000000003756),
      earnedTimestamp: 1724337615,
      periodFinish: 2677721600,
      totalSupply: NormalizedUnitNumber(100_000),
    },
  },
}

export default meta
type Story = StoryObj<typeof ActiveFarmInfoPanel>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
