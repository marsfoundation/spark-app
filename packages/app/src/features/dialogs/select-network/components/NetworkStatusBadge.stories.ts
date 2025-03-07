import { Meta, StoryObj } from '@storybook/react'

import { NetworkStatusBadge } from './NetworkStatusBadge'

const meta: Meta<typeof NetworkStatusBadge> = {
  title: 'Features/Dialogs/Components/SelectNetwork/NetworkStatusBadge',
  component: NetworkStatusBadge,
}

export default meta
type Story = StoryObj<typeof NetworkStatusBadge>

export const Connected: Story = {
  args: {
    status: 'connected',
  },
}
export const Pending: Story = {
  args: {
    status: 'pending',
  },
}
