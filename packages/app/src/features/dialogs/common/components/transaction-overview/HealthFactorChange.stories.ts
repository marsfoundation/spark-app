import { WithClassname } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'
import BigNumber from 'bignumber.js'

import { HealthFactorChange } from './HealthFactorChange'

const meta: Meta<typeof HealthFactorChange> = {
  title: 'Features/Dialogs/Components/HealthFactorChange',
  component: HealthFactorChange,
  decorators: [WithClassname('max-w-sm')],
}

export default meta
type Story = StoryObj<typeof meta>

export const RiskyToModerate: Story = {
  args: {
    currentHealthFactor: BigNumber(1.5),
    updatedHealthFactor: BigNumber(2.5),
  },
}

export const RiskyToHealthy: Story = {
  args: {
    currentHealthFactor: BigNumber(1.5),
    updatedHealthFactor: BigNumber(8),
  },
}

export const ModerateToHealthy: Story = {
  args: {
    currentHealthFactor: BigNumber(2.5),
    updatedHealthFactor: BigNumber(8),
  },
}

export const HealthyToModerate: Story = {
  args: {
    currentHealthFactor: BigNumber(8),
    updatedHealthFactor: BigNumber(2.5),
  },
}

export const HealthyToRisky: Story = {
  args: {
    currentHealthFactor: BigNumber(8),
    updatedHealthFactor: BigNumber(1.5),
  },
}

export const ModerateToRisky: Story = {
  args: {
    currentHealthFactor: BigNumber(2.5),
    updatedHealthFactor: BigNumber(1.5),
  },
}

export const HealthyToLiquidation: Story = {
  args: {
    currentHealthFactor: BigNumber(8),
    updatedHealthFactor: BigNumber(0.5),
  },
}

export const RiskyToNoDebt: Story = {
  args: {
    currentHealthFactor: BigNumber(1.5),
    updatedHealthFactor: BigNumber(Number.POSITIVE_INFINITY),
  },
}

export const OnlyUpdatedHealthFactor: Story = {
  args: {
    updatedHealthFactor: BigNumber(1.5),
  },
}
