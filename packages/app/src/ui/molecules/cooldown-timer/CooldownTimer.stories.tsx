import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'

import { CooldownTimer } from './CooldownTimer'

const meta: Meta<typeof CooldownTimer> = {
  title: 'Components/Molecules/CooldownTimer',
  decorators: [WithTooltipProvider()],
}

export default meta
type Story = StoryObj<typeof CooldownTimer>

export const Default: Story = {
  name: 'Default',
  render: () => (
    <div className="flex h-72 w-72 items-center justify-center">
      <CooldownTimer renewalPeriod={43200} latestUpdateTimestamp={1724891609} />
    </div>
  ),
}
