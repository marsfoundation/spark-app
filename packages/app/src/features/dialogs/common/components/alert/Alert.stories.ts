import { WithClassname } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'

import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Features/Dialogs/Components/Alert',
  component: Alert,
  decorators: [WithClassname('max-w-xl')],
}

export default meta
type Story = StoryObj<typeof Alert>

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
}
