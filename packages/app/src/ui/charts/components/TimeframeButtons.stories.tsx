import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { TimeframeButtons } from './TimeframeButtons'

const meta: Meta<typeof TimeframeButtons> = {
  title: 'Components/Charts/TimeframeButtons',
  component: TimeframeButtons,
  args: {
    availableTimeframes: ['1M', '3M', '1Y', 'All'],
    onTimeframeChange: () => {},
    selectedTimeframe: '1M',
  },
}

export default meta
type Story = StoryObj<typeof TimeframeButtons>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
