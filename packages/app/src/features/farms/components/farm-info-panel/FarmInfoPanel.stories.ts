import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { FarmInfoPanel } from './FarmInfoPanel'

const meta: Meta<typeof FarmInfoPanel> = {
  title: 'Features/Farms/Components/FarmInfoPanel',
  component: FarmInfoPanel,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
    apy: Percentage(0.05),
    assetsGroupType: 'stablecoins',
    rewardToken: tokens.MKR,
    depositors: 6,
    tvl: NormalizedUnitNumber(57_891),
  },
}

export default meta
type Story = StoryObj<typeof FarmInfoPanel>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
