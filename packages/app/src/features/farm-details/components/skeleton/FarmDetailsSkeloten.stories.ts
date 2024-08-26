import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { FarmDetailsSkeleton } from './FarmDetailsSkeleton'

const meta: Meta<typeof FarmDetailsSkeleton> = {
  title: 'Features/FarmDetails/Components/Skeleton',
  component: FarmDetailsSkeleton,
}

export default meta
type Story = StoryObj<typeof FarmDetailsSkeleton>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
