import { Meta, StoryObj } from '@storybook/react'
import BigNumber from 'bignumber.js'

import { HealthFactorBadge } from './HealthFactorBadge'

const meta: Meta<typeof HealthFactorBadge> = {
  title: 'Components/Atoms/HealthFactorBadge',
  component: (props) => (
    <div className="flex">
      <HealthFactorBadge {...props} />
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof meta>

export const Healthy: Story = {
  name: 'Healthy',
  args: {
    hf: new BigNumber(3.5),
  },
}

export const Risky: Story = {
  name: 'Risky',
  args: {
    hf: new BigNumber(1),
  },
}

export const Medium: Story = {
  name: 'Moderate',
  args: {
    hf: new BigNumber(2.5),
  },
}

export const Unknown: Story = {
  name: 'Unknown',
  args: {
    hf: undefined,
  },
}

export const NoDebt: Story = {
  name: 'No debt',
  args: {
    hf: new BigNumber(Infinity),
  },
}

export const Liquidation: Story = {
  name: 'Liquidation',
  args: {
    hf: new BigNumber(0.5),
  },
}
