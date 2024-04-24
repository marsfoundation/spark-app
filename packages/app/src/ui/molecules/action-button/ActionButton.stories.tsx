import type { Meta, StoryObj } from '@storybook/react'

import { ActionButton } from './ActionButton'

const meta: Meta<typeof ActionButton> = {
  title: 'Components/Molecules/ActionButton',
  component: ActionButton,
}

export default meta
type Story = StoryObj<typeof ActionButton>

export const LoadingMd: Story = {
  name: 'Loading',
  args: {
    children: 'Loading',
    isLoading: true,
  },
}

export const DoneMd: Story = {
  name: 'Done',
  args: {
    children: 'Done',
    isDone: true,
  },
}
