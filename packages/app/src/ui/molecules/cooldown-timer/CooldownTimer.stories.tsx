import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'

import { CooldownTimer } from './CooldownTimer'

const meta: Meta<typeof CooldownTimer> = {
  title: 'Components/Molecules/CooldownTimer',
  decorators: [WithTooltipProvider(), WithClassname('flex h-72 w-72 items-center justify-center')],
  component: CooldownTimer,
  args: {
    renewalPeriod: 43200,
    forceOpen: true,
  },
}

export default meta
type Story = StoryObj<typeof CooldownTimer>

export const Default: Story = {
  name: 'Default',
  args: {
    latestUpdateTimestamp: Math.floor(Date.now() / 1000 - 41903),
  },
}

export const Finished: Story = {
  name: 'Finished',
  args: {
    latestUpdateTimestamp: Math.floor(Date.now() / 1000 - 43200),
  },
}
