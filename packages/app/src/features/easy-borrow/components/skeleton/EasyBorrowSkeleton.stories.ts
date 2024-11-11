import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { EasyBorrowSkeleton } from './EasyBorrowSkeleton'

const meta: Meta<typeof EasyBorrowSkeleton> = {
  title: 'Features/EasyBorrow/Components/Skeleton',
  component: EasyBorrowSkeleton,
}

export default meta
type Story = StoryObj<typeof EasyBorrowSkeleton>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
