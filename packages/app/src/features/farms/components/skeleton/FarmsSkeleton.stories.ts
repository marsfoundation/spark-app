import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { FarmsSkeleton } from './FarmsSkeleton'

const meta: Meta<typeof FarmsSkeleton> = {
  title: 'Features/Farms/Components/Skeleton',
  component: FarmsSkeleton,
}

export default meta
type Story = StoryObj<typeof FarmsSkeleton>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
