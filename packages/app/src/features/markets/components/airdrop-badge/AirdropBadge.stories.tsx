import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { getHoveredStory } from '@sb/utils'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import { AirdropBadge } from './AirdropBadge'

const meta: Meta<typeof AirdropBadge> = {
  title: 'Features/Markets/Components/AirdropBadge',
  component: AirdropBadge,
  decorators: [
    WithTooltipProvider(),
    withRouter,
    WithClassname('bg-white flex justify-center p-8 items-end w-96 h-64'),
  ],
}

export default meta
type Story = StoryObj<typeof AirdropBadge>

export const Default: Story = {
  name: 'Default',
}

export const Hovered = getHoveredStory(Default, 'button')
