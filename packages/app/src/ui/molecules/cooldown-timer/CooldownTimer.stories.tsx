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
  render: () => {
    const timestamp = Math.floor(Date.now() / 1000 - 41903)

    return (
      <div className="flex h-72 w-72 items-center justify-center">
        <CooldownTimer renewalPeriod={43200} latestUpdateTimestamp={timestamp} />
      </div>
    )
  },
}

export const Finished: Story = {
  name: 'Finished',
  render: () => {
    const timestamp = Math.floor(Date.now() / 1000 - 43200)

    return (
      <div className="flex h-72 w-72 items-center justify-center">
        <CooldownTimer renewalPeriod={43200} latestUpdateTimestamp={timestamp} />
      </div>
    )
  },
}
