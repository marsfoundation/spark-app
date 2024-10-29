import { WithClassname, WithTooltipProvider } from '@storybook-config/decorators'
import { getHoveredStory } from '@storybook-config/utils'
import { Meta, StoryObj } from '@storybook/react'

import { PausedPill } from './PausedPill'

const meta: Meta<typeof PausedPill> = {
  title: 'Components/Molecules/PausedPill',
  component: PausedPill,
  decorators: [WithTooltipProvider(), WithClassname('bg-white flex justify-center p-8 items-end w-96 h-56')],
}

export default meta
type Story = StoryObj<typeof PausedPill>

export const Default: Story = {
  name: 'Default',
}

export const Hovered = getHoveredStory(Default, 'button')
