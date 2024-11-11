import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { FarmDetailsSkeleton } from './FarmDetailsSkeleton'

const meta: Meta<typeof FarmDetailsSkeleton> = {
  title: 'Features/FarmDetails/Components/Skeleton',
  component: FarmDetailsSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof FarmDetailsSkeleton>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
