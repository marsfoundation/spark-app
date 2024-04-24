import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'

import { EModeSwitch } from './EModeSwitch'

const meta: Meta<typeof EModeSwitch> = {
  title: 'Features/Dashboard/Components/BorrowTable/Components/EModeSwitch',
  decorators: [WithTooltipProvider()],
  component: EModeSwitch,
  args: {
    onSwitchClick: () => {},
  },
}

export default meta
type Story = StoryObj<typeof EModeSwitch>

export const EModeOff: Story = {
  name: 'E-Mode Off',
  args: {
    eModeCategoryId: 0,
  },
}

export const EModeETHCorrelated: Story = {
  name: 'E-Mode ETH Correlated',
  args: {
    eModeCategoryId: 1,
  },
}

export const EModeStablecoins: Story = {
  name: 'E-Mode Stablecoins',
  args: {
    eModeCategoryId: 2,
  },
}
