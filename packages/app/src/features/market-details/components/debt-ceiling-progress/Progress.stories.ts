import { WithClassname } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'

import { Progress } from './Progress'

const meta: Meta<typeof Progress> = {
  title: 'Features/MarketDetails/Components/MyWallet/DebtCeilingProgress/Progress',
  component: Progress,
  decorators: [WithClassname('max-w-sm')],
}

export default meta
type Story = StoryObj<typeof meta>

export const Zero: Story = {
  args: {
    value: 0,
  },
}

export const Quarter: Story = {
  args: {
    value: 25,
  },
}

export const Half: Story = {
  args: {
    value: 50,
  },
}

export const Full: Story = {
  args: {
    variant: 'finished',
    value: 100,
  },
}
