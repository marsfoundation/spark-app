import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getHoveredStory } from '@storybook/utils'
import { withRouter } from 'storybook-addon-react-router-v6'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { AirdropBadge } from './AirdropBadge'

const meta: Meta<typeof AirdropBadge> = {
  title: 'Features/Markets/Components/AirdropBadge',
  component: AirdropBadge,
  decorators: [
    WithTooltipProvider(),
    withRouter,
    WithClassname('bg-white flex justify-center p-8 items-end w-96 h-64'),
  ],
  args: {
    value: NormalizedUnitNumber(24_000_000),
  },
}

export default meta
type Story = StoryObj<typeof AirdropBadge>

export const Default: Story = {
  name: 'Default',
}

export const Hovered = getHoveredStory(Default, 'button')
