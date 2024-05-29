import { Meta, StoryObj } from '@storybook/react'
import BigNumber from 'bignumber.js'

import { RiskIndicator } from './RiskIndicator'

const meta: Meta<typeof RiskIndicator> = {
  title: 'Features/Dialogs/Components/RiskIndicator',
  component: RiskIndicator,
}

export default meta
type Story = StoryObj<typeof meta>

export const Risky: Story = {
  name: 'Risky',
  args: {
    healthFactor: new BigNumber(1),
  },
}

export const Moderate: Story = {
  name: 'Moderate',
  args: {
    healthFactor: new BigNumber(2.5),
  },
}

export const Healthy: Story = {
  name: 'Healthy',
  args: {
    healthFactor: new BigNumber(3.5),
  },
}

export const NoDebt: Story = {
  name: 'No debt',
  args: {
    healthFactor: new BigNumber(Number.POSITIVE_INFINITY),
  },
}

export const Liquidation: Story = {
  name: 'Liquidation',
  args: {
    healthFactor: new BigNumber(0.5),
  },
}
