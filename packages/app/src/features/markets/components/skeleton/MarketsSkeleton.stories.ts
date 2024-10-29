import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { MarketsSkeleton } from './MarketsSkeleton'

const meta: Meta<typeof MarketsSkeleton> = {
  title: 'Features/Markets/Components/Skeleton',
  component: MarketsSkeleton,
}

export default meta
type Story = StoryObj<typeof MarketsSkeleton>

export const Desktop: Story = {}

export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
