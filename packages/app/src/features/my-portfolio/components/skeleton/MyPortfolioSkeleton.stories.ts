import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { MyPortfolioSkeleton } from './MyPortfolioSkeleton'

const meta: Meta<typeof MyPortfolioSkeleton> = {
  title: 'Features/MyPortfolio/Components/Skeleton',
  component: MyPortfolioSkeleton,
}

export default meta
type Story = StoryObj<typeof MyPortfolioSkeleton>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
