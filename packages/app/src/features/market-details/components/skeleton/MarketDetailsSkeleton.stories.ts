import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { MarketDetailsSkeleton } from './MarketDetailsSkeleton'

const meta: Meta<typeof MarketDetailsSkeleton> = {
  title: 'Features/MarketDetails/Components/Skeleton',
  component: MarketDetailsSkeleton,
}

export default meta
type Story = StoryObj<typeof MarketDetailsSkeleton>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
