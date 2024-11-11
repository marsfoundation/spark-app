import { WithTooltipProvider } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'

import { SavingsInfoTile } from './SavingsInfoTile'

const meta: Meta<typeof SavingsInfoTile> = {
  title: 'Features/Savings/Components/SavingsInfoTile',
  component: SavingsInfoTile,
  decorators: [WithTooltipProvider()],
}

export default meta
type Story = StoryObj<typeof SavingsInfoTile>

export const Default: Story = {
  render: () => {
    return (
      <SavingsInfoTile>
        <SavingsInfoTile.Label tooltipContent="Tooltip text.">30-day projection</SavingsInfoTile.Label>
        <SavingsInfoTile.Value>+60$</SavingsInfoTile.Value>
      </SavingsInfoTile>
    )
  },
}
