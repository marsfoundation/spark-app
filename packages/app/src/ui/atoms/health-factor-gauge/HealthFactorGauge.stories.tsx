import { WithClassname } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import BigNumber from 'bignumber.js'

import { HealthFactorGauge } from './HealthFactorGauge'

const meta: Meta<typeof HealthFactorGauge> = {
  title: 'Components/Atoms/HealthFactorGauge',
  decorators: [WithClassname('max-w-md')],
  component: HealthFactorGauge,
}

export default meta
type Story = StoryObj<typeof HealthFactorGauge>

export const Medium: Story = {
  name: 'Moderate',
  args: {
    value: new BigNumber(2.5),
  },
}

export const Risky: Story = {
  name: 'Risky',
  args: {
    value: new BigNumber(1.7),
  },
}

export const Safe: Story = {
  name: 'Safe',
  args: {
    value: new BigNumber(3.3),
  },
}

export const Unknown: Story = {
  name: 'Unknown',
  args: {
    value: undefined,
  },
}

export const Liquidation: Story = {
  name: 'Liquidation',
  args: {
    value: new BigNumber(0.5),
  },
}

export const NoDebt: Story = {
  name: 'No debt',
  args: {
    value: new BigNumber(Number.POSITIVE_INFINITY),
  },
}
