import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { getHoveredStory } from '@sb/utils'
import { Meta, StoryObj } from '@storybook/react'

import { FrozenPill } from './FrozenPill'

const meta: Meta<typeof FrozenPill> = {
  title: 'Components/Molecules/FrozenPill',
  component: FrozenPill,
  decorators: [WithTooltipProvider(), WithClassname('bg-white flex justify-center p-8 items-end w-96 h-56')],
}

export default meta
type Story = StoryObj<typeof FrozenPill>

export const Default: Story = {
  name: 'Default',
  args: {},
}

export const Hovered = getHoveredStory(Default, 'button')
