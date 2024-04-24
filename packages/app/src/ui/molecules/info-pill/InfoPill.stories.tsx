import { WithTooltipProvider } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'

import { InfoPill } from './InfoPill'

const meta: Meta<typeof InfoPill> = {
  title: 'Components/Molecules/InfoPill',
  component: InfoPill,
  decorators: [WithTooltipProvider()],
}

export default meta
type Story = StoryObj<typeof InfoPill>

export const Default: Story = {
  name: 'Default',
  args: {
    text: 'Market risk',
    tooltip: 'This is a tooltip',
  },
}
