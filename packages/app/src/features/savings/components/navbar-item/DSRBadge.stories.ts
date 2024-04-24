import { Meta, StoryObj } from '@storybook/react'

import { Percentage } from '@/domain/types/NumericValues'

import { DSRBadge } from './DSRBadge'

const meta: Meta<typeof DSRBadge> = {
  title: 'Features/Savings/Components/NavbarItem/DSRBadge',
  component: DSRBadge,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    dsr: Percentage(0.05),
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const TwoDecimals: Story = {
  name: 'Two decimals',
  args: {
    dsr: Percentage(0.0497),
  },
}
