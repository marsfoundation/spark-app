import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'

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
