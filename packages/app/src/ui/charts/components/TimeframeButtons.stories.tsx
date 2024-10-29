import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { TimeframeButtons } from './TimeframeButtons'

const meta: Meta<typeof TimeframeButtons> = {
  title: 'Components/Charts/TimeframeButtons',
  component: TimeframeButtons,
}

export default meta
type Story = StoryObj<typeof TimeframeButtons>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
