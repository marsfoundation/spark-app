import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
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
