import { Meta, StoryObj } from '@storybook/react'

import { EModeBadge } from './EModeBadge'

const meta: Meta<typeof EModeBadge> = {
  title: 'Features/MarketDetails/Components/StatusPanel/Components/EModeBadge',
  component: EModeBadge,
}

export default meta
type Story = StoryObj<typeof EModeBadge>

export const ETHCorrelated: Story = {
  name: 'ETH Correlated',
  args: {
    category: 'ETH Correlated',
  },
}
export const Stablecoins: Story = {
  name: 'Stablecoins',
  args: {
    category: 'Stablecoins',
  },
}
