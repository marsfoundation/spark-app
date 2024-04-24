import { Meta, StoryObj } from '@storybook/react'

import { ActionsSkeleton } from './ActionsSkeleton'

const meta: Meta<typeof ActionsSkeleton> = {
  title: 'Features/Actions/Skeleton',
  component: ActionsSkeleton,
}

export default meta
type Story = StoryObj<typeof ActionsSkeleton>

export const ActionsSkeletonStory: Story = {
  name: 'ActionsSkeleton',
}
