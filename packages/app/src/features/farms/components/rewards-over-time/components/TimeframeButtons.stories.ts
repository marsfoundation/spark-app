import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { TimeframeButtons } from './TimeframeButtons'

const meta: Meta<typeof TimeframeButtons> = {
  title: 'Features/Farms/Components/RewardsOverTime/Components/TimeframeButtons',
  component: TimeframeButtons,
}

export default meta
type Story = StoryObj<typeof TimeframeButtons>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
