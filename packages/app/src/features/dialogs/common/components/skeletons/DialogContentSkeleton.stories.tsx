import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { DialogContentSkeleton } from './DialogContentSkeleton'

const meta: Meta<typeof DialogContentSkeleton> = {
  title: 'Features/Dialogs/Skeletons/DialogContentSkeleton',
  component: DialogContentSkeleton,
}

export default meta
type Story = StoryObj<typeof DialogContentSkeleton>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
