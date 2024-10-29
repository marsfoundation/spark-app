import { WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { Meta, StoryObj } from '@storybook/react'

import { AssetNameCell } from './AssetNameCell'

const meta: Meta<typeof AssetNameCell> = {
  title: 'Features/Markets/Components/MarketsTable/Components/AssetNameCell',
  component: AssetNameCell,
  decorators: [WithTooltipProvider()],
  args: {
    token: tokens.rETH,
    reserveStatus: 'active',
  },
}

export default meta
type Story = StoryObj<typeof AssetNameCell>

export const Default: Story = {
  name: 'Default',
}

export const Frozen: Story = {
  name: 'Frozen',
  args: {
    token: tokens.rETH,
    reserveStatus: 'frozen',
  },
}
