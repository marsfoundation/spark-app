import { Meta, StoryObj } from '@storybook/react'

import { EModeBadge } from './EModeBadge'

const meta: Meta<typeof EModeBadge> = {
  title: 'Components/Molecules/EModeBadge',
  component: EModeBadge,
}

export default meta
type Story = StoryObj<typeof EModeBadge>

export const NoEMode: Story = {
  name: 'No E-Mode',
  args: {
    categoryId: 0,
  },
}

export const ETHCorrelated: Story = {
  name: 'ETH Correlated',
  args: {
    categoryId: 1,
  },
}
export const Stablecoins: Story = {
  name: 'Stablecoins',
  args: {
    categoryId: 2,
  },
}
