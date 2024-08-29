import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { FarmInfoPanel } from './FarmInfoPanel'

const meta: Meta<typeof FarmInfoPanel> = {
  title: 'Features/FarmDetails/Components/FarmInfoPanel',
  component: FarmInfoPanel,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
    assetsGroupType: 'stablecoins',
    rewardToken: tokens.MKR,
    farmDetailsRowData: {
      depositors: 6,
      tvl: NormalizedUnitNumber(57_891),
      apy: Percentage(0.05),
    },
    walletConnected: true,
  },
}

export default meta
type Story = StoryObj<typeof FarmInfoPanel>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
