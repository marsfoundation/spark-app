import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { SavingsSkeleton } from './SavingsSkeleton'

const meta: Meta<typeof SavingsSkeleton> = {
  title: 'Features/Savings/Components/Skeleton',
  component: SavingsSkeleton,
}

export default meta
type Story = StoryObj<typeof SavingsSkeleton>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
