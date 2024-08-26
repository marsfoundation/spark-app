import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { FarmDetailsRow } from './FarmDetailsRow'

const meta: Meta<typeof FarmDetailsRow> = {
  title: 'Features/Farms/Components/FarmDetailsRow',
  component: FarmDetailsRow,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
    farmDetailsRowData: {
      depositors: 6,
      tvl: NormalizedUnitNumber(57_891),
      apy: Percentage(0.05),
    },
  },
}

export default meta
type Story = StoryObj<typeof FarmDetailsRow>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
